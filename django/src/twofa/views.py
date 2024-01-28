from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.utils.translation import gettext as _
from django.conf import settings
from API.models import Users 
from API.views import add_user_API
from .forms import Form2FA, Form2FAEmail
from pyotp.totp import TOTP
import pyotp
import qrcode
import jwt
import io
import base64
import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from django.http import JsonResponse
import json
from django.shortcuts import render


def create_qr_code(user):
	uri = TOTP(user.token_2FA).provisioning_uri(name=user.username, issuer_name="Pong App")
	qr_img = qrcode.make(uri)
	# Create an in-memory buffer using io.BytesIO
	buffer = io.BytesIO()
	# Save the QR code image to the buffer
	qr_img.save(buffer)
	# Convert the buffer to a base64-encoded string
	buffer_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
	# Return the base64-encoded string
	return buffer_data

def create_jwt(user):
	# Get the current time
	now = datetime.datetime.utcnow()

	# Set the token to expire 1 hour from now
	exp_time = now + datetime.timedelta(hours=48)
	payload = {
	'username': user.username,
	'exp': exp_time,
	}
	token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
	user.jwt = token
	user.save()
	return token

def _user_jwt_cookie(request):
	try:
		token = request.COOKIES.get('jwt_token')
		options = {'verify_exp': False}
		payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options=options)
		user = Users.objects.get(username=payload['username'])
		return user
	except Exception as exc:
		return None

def _jwt_is_expired(jwt_token):
	try:
		payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
		return False
	except Exception as exc:
		return True

def qr_setup(request, wrong_code=False):
	token = request.COOKIES.get('jwt_token')
	user = _user_jwt_cookie(request)
	user.qr_2FA = True
	user.email_2FA = False
	user.save()
	qr_code = create_qr_code(user)
	if not wrong_code:
			error_msg = ''
	else:
		error_msg = _('Invalid code, try again.')
	return {
		"form": Form2FA(),
		"qr_code": qr_code,
		"error_msg": error_msg,
		"section": "qr_setup.html",
	}, token

def send_email(user, code):
	smtp_server = os.environ.get("SMTP_SERVER")
	port = os.environ.get("SMTP_PORT")

	from_addr = os.environ.get("EMAIL_2FA")
	to_addr = user.email

	msg = MIMEMultipart()
	msg['From'] = from_addr
	msg['To'] = to_addr
	msg['Subject'] = _('Validate your account')

	message = _("Your verification code is: ") + code
	msg.attach(MIMEText(message, 'plain'))

	server = smtplib.SMTP(smtp_server, port)
	server.starttls()
	server.login(from_addr, os.environ.get("EMAIL_PASSWORD"))
	text = msg.as_string()
	server.sendmail(from_addr, to_addr, text)
	server.quit()
 
def email_setup(request, wrong_code=False):
	token = request.COOKIES.get('jwt_token')
	user = _user_jwt_cookie(request)
	user.qr_2FA = False
	user.email_2FA = True
	code = TOTP(user.token_2FA).now()
	send_email(user, code)
	user.save()
	if not wrong_code:
		error_msg = ''
	else:
		error_msg = _('Invalid code, try again.')
	
	msg = _('Please enter the code sent to your email:')
	form = Form2FAEmail()
	url = '/post_twofa_code/'

	return {
		"msg": msg,
		"form": form,
		"url": url,
		"error_msg": error_msg,
		"section": "email_setup.html",
	}, token

@csrf_protect
def twofa(request, wrong_code=False, expired_jwt=False):
	token = None
	language = "en"
	try:
		if not request.COOKIES.get('jwt_token') \
			or request.COOKIES.get('jwt_token') == 'None':
			user = add_user_API(request)
			token = create_jwt(user)
			user.validated_2fa = False
			user.save()
			expired_jwt = True
		else:
			token = request.COOKIES.get('jwt_token')
			if _jwt_is_expired(token):
				expired_jwt = True
			user = _user_jwt_cookie(request)
		if user is None:
			return {
				"error_msg": _("User not found"),
				"section": "error_page.html",
			}, None, language
		
		if user.active_2FA and not expired_jwt and user.validated_2fa:
			return {
				"username": user.username,
				"email": user.email,
				"section": "temporal_loggedin.html",
			}, token, user.language
		else:
			if not wrong_code:
				error_msg = ''
			else:
				error_msg = _('Invalid code, try again.')
			if not (user.active_2FA):
				if user.qr_2FA and wrong_code:
					return qr_setup(request, wrong_code)
				if user.email_2FA and wrong_code:
					return email_setup(request, wrong_code)
				return {
					"section": "2fa_setup.html",
				}, token,  user.language
			else:
				if user.email_2FA:
					code = TOTP(user.token_2FA).now()
					send_email(user, code)
				return {
					"form": Form2FA(),
					"error_msg": error_msg,
					"section": "twofa.html",
				}, token,  user.language
	except Exception as exc:
		return {
			"error_msg": _("Error: "),
			"section": "error_page.html",
		}, None, language

def validate_user(request):
	try:
		token = request.COOKIES.get('jwt_token')
		if _jwt_is_expired(token):
			return False
		payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
		user = Users.objects.get(username=payload['username'])

		if user.active_2FA:
			return True
		else:
			return False
	except Exception as exc:
		return False

def validate_code(user, user_code):
	if user_code and len(user_code) != 6:
		return False
	try:
		totp = pyotp.TOTP(user.token_2FA)
		if not (totp.verify(user_code)):
			return False
		else:
			return True
	except Exception as exc:
		return False


def is_twofa_valid(user, code):
	is_valid = validate_code(user, code)
	return is_valid


def twofa_valid_flow(request, user):
	user.active_2FA = True
	user.validated_2fa = True

	if _jwt_is_expired(request.COOKIES.get('jwt_token')):
		user.jwt = create_jwt(user)
	user.save()

	data = {"isValid": True, "username": user.username}
	response_body = json.dumps(data)

	res = HttpResponse(response_body, content_type='application/json', status=200)

	res.set_cookie("jwt_token", user.jwt, httponly=True, secure=False)

	return res


@csrf_protect
def post_twofa_code(request):
	if request.method == "POST":
		user = _user_jwt_cookie(request)
		code = request.POST.get('code')

		if is_twofa_valid(user, code):
			return twofa_valid_flow(request, user)

	res = {
		"isValid": False,
		"username": "",
	}

	return JsonResponse(res)


@csrf_protect
def get_validate_2fa(request):
	user = _user_jwt_cookie(request)
	user_code = request.POST.get('code')
	is_valid = validate_code(user, user_code)

	if is_valid:
		user.active_2FA = True
		user.validated_2fa = True
		if _jwt_is_expired(request.COOKIES.get('jwt_token')):
			user.jwt = create_jwt(user)
		user.save()
		return {
			"username": user.username,
			"email": user.email,
			"section": "temporal_loggedin.html", 
		}, user.jwt
	else:
		user.validated_2fa = False
		user.save()
		return twofa(request, wrong_code=True)
	
def delete_jwt(request):
	token = request.COOKIES.get('jwt_token')
	if token is None:
		return
	options = {'verify_exp': False}
	payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options=options)
	user = Users.objects.get(username=payload['username'])
	user.jwt = None
	user.validated_2fa = False
	user.save()
	return


def get_qr_setup(request):
	context, token = qr_setup(request)
	context["section"] = ""

	res = render(request, "qr_setup.html", context)

	res.set_cookie("jwt_token", token, httponly=True, secure=False)

	return res


def get_email_setup(request):
	context, token = email_setup(request)
	context["section"] = ""

	res = render(request, "email_setup.html", context)

	res.set_cookie("jwt_token", token, httponly=True, secure=False)

	return res

def get_twofa(request):
	context, token, lang = twofa(request)

	res = render(request, context["section"], context)

	res.set_cookie("jwt_token", token, httponly=True, secure=False)

	return res



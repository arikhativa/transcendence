from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from django.conf import settings
from API.models import Users 
from API.views import add_user_API
from .forms import Form2FA, FormPhone, Form2FAEmail
from pyotp.totp import TOTP
import pyotp
import qrcode
import jwt
import io
import base64
from jwt.exceptions import ExpiredSignatureError
import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import secrets
import string



def create_qr_code(user):
	"""
	Create a QR code for the given user.

	The QR code is created using the user's 2FA token and is returned as a base64-encoded string.

	Args:
		user: The user for whom to create the QR code.

	Returns:
		A base64-encoded string representing the QR code.
	"""
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
	exp_time = now + datetime.timedelta(hours=24)
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
	user.sms_2FA = False
	user.email_2FA = False
	user.save()
	qr_code = create_qr_code(user)
	if not wrong_code:
			error_msg = ''
	else:
		error_msg = 'Invalid code, try again.'
	return {
		"form": Form2FA(),
		"qr_code": qr_code,
		"error_msg": error_msg,
		"section": "qr_setup.html",
	}, token

def sms_setup(request, wrong_code=False):
	token = request.COOKIES.get('jwt_token')
	user = _user_jwt_cookie(request)
	if not wrong_code:
		user_phone = request.POST.get('phone')
		user.phone = user_phone
	user.qr_2FA = False
	user.sms_2FA = True
	user.email_2FA = False
	user.save()
	if not wrong_code:
		error_msg = ''
	else:
		error_msg = 'Invalid code, try again.'
	
	if user.phone == None and not wrong_code:
		msg = 'Please enter your phone number:'
		form = FormPhone()
		url = '/twofa/sms_setup'
	else:
		msg = 'Please enter the code sent to your phone:'
		form = Form2FA()
		url = '/validate_2fa_code/'
	
	return {
		"msg": msg,
		"form": form,
		"url": url,
		"error_msg": error_msg,
		"section": "sms_setup.html",
	}, token

def send_email(user, code):
	smtp_server = os.environ.get("SMTP_SERVER")
	port = os.environ.get("SMTP_PORT")

	from_addr = os.environ.get("EMAIL_2FA")
	to_addr = user.email

	msg = MIMEMultipart()
	msg['From'] = from_addr
	msg['To'] = to_addr
	msg['Subject'] = 'Validate your account'

	message = "Your verification code is: " + code
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
	user.sms_2FA = False
	user.email_2FA = True
	code = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(6))
	user.token_2FA = code
	send_email(user, code)
	user.save()
	if not wrong_code:
		error_msg = ''
	else:
		error_msg = 'Invalid code, try again.'
	
	msg = 'Please enter the code sent to your email:'
	form = Form2FAEmail()
	url = '/validate_2fa_code/'

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
	if not request.COOKIES.get('jwt_token') \
		or request.COOKIES.get('jwt_token') == 'None':

		user = add_user_API(request)
		token = create_jwt(user)
	else:
		token = request.COOKIES.get('jwt_token')
		if _jwt_is_expired(token):
			expired_jwt = True
		user = _user_jwt_cookie(request)
	if user is None:
		return {
			"error_msg": "User not found",
			"section": "error_page.html",
		}, None
	if user.active_2FA and not expired_jwt:
		return {
			"username": user.username,
			"email": user.email,
			"section": "temporal_loggedin.html",
		}, token
	else:
		if not wrong_code:
			error_msg = ''
		else:
			error_msg = 'Invalid code, try again.'
		if not (user.active_2FA):
			#TODO: Check which 2FA method was selected.
			if user.qr_2FA and wrong_code:
				return qr_setup(request, wrong_code)
			if user.sms_2FA and wrong_code:
				return sms_setup(request, wrong_code)
			if user.email_2FA and wrong_code:
				return email_setup(request, wrong_code)
			return {
				"section": "2fa_setup.html",
			}, token
		else:
			return {
				"form": Form2FA(),
				"error_msg": error_msg,
				"section": "twofa.html",
			}, token

def validate_user(request):
	try:
		token = request.COOKIES.get('jwt_token')
		if _jwt_is_expired(token):
			return False
		payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
		user = Users.objects.get(username=payload['username'])

		#make sure the jwt is the same as the one in the db
		if user.active_2FA:
			return True
		else:
			return False
	except Exception as exc:
		return False

def validate_code_qr(user, user_code):
	try:
		totp = pyotp.TOTP(user.token_2FA)
		if not (totp.verify(user_code)):
			return False
		else:
			return True
	except Exception as exc:
		return False
	
#TODO: def validate_code_sms(request):


def validate_code_email(user, code):
	if user.email_2fa and user.token_2FA == code:
		return True
	return False

@csrf_protect
def validate_2fa(request):

	user = _user_jwt_cookie(request)
	
	user_code = request.POST.get('code') 
	#TODO: Check which type of 2FA is being used and validate accordingly
	is_valid = validate_code_qr(user, user_code)

	if is_valid:
		user.active_2FA = True
		if _jwt_is_expired(request.COOKIES.get('jwt_token')):
			user.jwt = create_jwt(user)
		user.save()
		return {
			"username": user.username,
			"email": user.email,
			"section": "temporal_loggedin.html", 
		}, user.jwt
	else:
		return twofa(request, wrong_code=True)
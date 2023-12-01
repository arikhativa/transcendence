from django.views.decorators.csrf import csrf_protect
from API.models import Users 
from API.views import add_user_API
from .forms import Form2FA
from pyotp.totp import TOTP
import pyotp
import qrcode
from django.conf import settings
import jwt
import io
import base64
from jwt.exceptions import ExpiredSignatureError
import datetime


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
	exp_time = now + datetime.timedelta(seconds=30)
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

@csrf_protect
def twofa(request, wrong_code=False, expired_jwt=False):
	token = None
	if not request.COOKIES.get('jwt_token'):
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
		form = Form2FA()
		if not wrong_code:
			error_msg = ''
		else:
			error_msg = 'Invalid code, try again.'
		if not (user.active_2FA):
			qr_code = create_qr_code(user)
			return {
				"form": form,
				"qr_code": qr_code,
				"error_msg": error_msg,
				"section": "first_login.html",
			}, token
		else:
			return {
				"form": form,
				"error_msg": error_msg,
				"section": "twofa.html",
			}, token

def validate_code(user, user_code):
	try:
		totp = pyotp.TOTP(user.token_2FA)
		if not (totp.verify(user_code)):
			return False
		else:
			return True
	except Exception as exc:
		return False

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

@csrf_protect
def validate_2fa(request):

	user = _user_jwt_cookie(request)
	
	user_code = request.POST.get('code') 
	is_valid = validate_code(user, user_code)

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
		return twofa(request, True)
from django.shortcuts import render, HttpResponse, redirect
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
from django.contrib.sessions.models import Session

from django.template.loader import render_to_string


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
	"""
    Create a JWT for the given user.

    The JWT is created using the user's username and is saved to the user.

    Args:
        user: The user for whom to create the JWT.

    Returns:
        The created JWT.
    """
	token = jwt.encode({'username': user.username}, settings.SECRET_KEY, algorithm='HS256')
	user.jwt = token
	user.save()
	return token

def _user_jwt_cookie(request):
	"""
    Get the user from the JWT cookie in the request.

    The JWT is decoded and the user is retrieved from the database using the username in the JWT.

    Args:
        request: The HTTP request.

    Returns:
        The user retrieved from the JWT cookie.
    """
	token = request.COOKIES.get('jwt_token')
	payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
	user = Users.objects.get(username=payload['username'])
	return user

@csrf_protect
def twofa(request, wrong_code=False):
	"""
    Handle a 2FA request.

    If the user has not yet set the JWT cookie, a new user is added and a JWT is created for them.

    Args:
        request: The HTTP request.
        wrong_code: Whether the 2FA code was wrong.

    Returns:
        An HTTP response.
    """
	try:
		# if the user has not yet set the cookie
		if not request.COOKIES.get('jwt_token'):
			user = add_user_API(request)
			token = create_jwt(user)
		else:
			try:
				user = _user_jwt_cookie(request)
			except Exception as exc:
				user = add_user_API(request)
			token = create_jwt(user)

		jwt_token = request.session.get('jwt_token', None)
		if jwt_token and user.active_2FA:
			return {
				"username": user.username,
				"email": user.email,
				"section": "temporal_loggedin.html",
			}, jwt_token
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
	except Exception as exc:
		return HttpResponse(exc)

def validate_code(user, user_code):
	"""
    Validate the given 2FA code for the given user.

    The code is verified using the user's 2FA token.

    Args:
        user: The user for whom to validate the code.
        user_code: The 2FA code to validate.

    Returns:
        True if the code is valid, False otherwise.
    """
	totp = pyotp.TOTP(user.token_2FA)
	if not (totp.verify(user_code)):
		return False
	else:
		return True

def validate_user(request):
	"""
    Validate the user in the given request.

    The user is retrieved from the JWT cookie in the request and is considered valid if they have 2FA enabled.

    Args:
        request: The HTTP request.

    Returns:
        True if the user is valid, False otherwise.
    """
	try:
		token = request.COOKIES.get('jwt_token')
		#make sure the jwt is not expired
		payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
		user = Users.objects.get(username=payload['username'])
		#make sure the jwt is the same as the one in the db
		if not user.jwt == token:
			return False
		if user.active_2FA:
			request.session['jwt_token'] = token
			return True
		else:
			return False
	except Exception as exc:
		return False

@csrf_protect
def validate_2fa(request):
	"""
    Handle a QR validation request.

    The user is retrieved from the JWT cookie in the request and their 2FA code is validated.

    Args:
        request: The HTTP request.

    Returns:
        An HTTP response.
    """
	user = _user_jwt_cookie(request)
	user_code = request.POST.get('code')
	is_valid = validate_code(user, user_code)

	if is_valid:
		user.active_2FA = True
		user.save()
		return {
			"username": user.username,
			"email": user.email,
			"section": "temporal_loggedin.html",
		}, None
	else:
		return twofa(request, True)
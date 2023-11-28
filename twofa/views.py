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

def create_2FA_form(request, user):
	if request.method == 'POST':
		form = Form2FA(request.POST)
		if form.is_valid():
			input_2FA = form.cleaned_data['code_2FA']
			totp = pyotp.TOTP(user.token_2FA)
			if not (totp.verify(input_2FA)):
				print(form.errors)
			else:
				user.active_2FA = True
				user.save()
	else:
		form = Form2FA()
	return form


def create_jwt(user):
	token = jwt.encode({'username': user.username}, settings.SECRET_KEY, algorithm='HS256')
	user.jwt = token
	user.save()
	return token

def _user_jwt_cookie(request):
	token = request.COOKIES.get('jwt_token')
	payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
	user = Users.objects.get(username=payload['username'])
	return user

@csrf_protect
def twofa(request, wrong_code=False):
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

		if not (user.active_2FA):
			qr_code = create_qr_code(user)
			form = Form2FA()
			if not wrong_code:
				response = render(request, 'first_login.html', {'form': form, 'qr_code': qr_code})
			else:
				error_msg = 'Invalid code, try again.'
				response = render(request, 'first_login.html', {'form': form, 'qr_code': qr_code, 'error_msg': error_msg})
			response.set_cookie('jwt_token', token, httponly=True, secure=False)
			return response
		else:
			response = HttpResponse(f"Hello {user.username} , email {user.email}!")
			response.set_cookie('jwt_token', token, httponly=True, secure=False)
			return response
	except Exception as exc:
		return HttpResponse(exc)

def validate_code(user, user_code):
	totp = pyotp.TOTP(user.token_2FA)
	if not (totp.verify(user_code)):
		return False
	else:
		return True

def validate_user(request):
    #user has to be logged in to access this page and have 2FA enabled
    try:
        token = request.COOKIES.get('jwt_token')
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = Users.objects.get(username=payload['username'])
        if user.active_2FA:
            return True
        else:
            return False
    except Exception as exc:
        return False

@csrf_protect
def validate_qr(request):
	user = _user_jwt_cookie(request)
	user_code = request.POST.get('code')
	is_valid = validate_code(user, user_code)

	if is_valid:
		user.active_2FA = True
		user.save()
		return HttpResponse(f"Hello {user.username} , email {user.email}!")
	else:
		response = twofa(request, True)
		return response
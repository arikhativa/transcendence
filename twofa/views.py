from django.shortcuts import render, HttpResponse, redirect
from API.models import Users 
from API.views import add_user_API
from .forms import Form2FA
import pyotp
import qrcode
from django.conf import settings
import jwt


def create_qr_code(user):
	uri = pyotp.totp.TOTP(user.token_2FA).provisioning_uri(name=user.username, issuer_name="Pong App")
	img_url = f"twofa/static/QR_codes/{user.username}.png"
	qrcode.make(uri).save(img_url)
	return img_url

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


def twofa(request):
	try:
		# if the user has not yet set the cookie
		if not request.COOKIES.get('jwt_token'):
			user = add_user_API(request)
			token = create_jwt(user)
		else:
			user = _user_jwt_cookie(request)
			token = create_jwt(user)

		if not (user.active_2FA):
			qr_code = create_qr_code(user)
			form = create_2FA_form(request, user)
			qr_code = f'static/QR_codes/{user.username}.png'
			response = render(request, 'first_login.html', {'form': form, 'qr_code': qr_code})
			response.set_cookie('jwt_token', token, httponly=True, secure=False)
			return response
		else:
			response = HttpResponse(f"Hello {user.username} , email {user.email}!")
			response.set_cookie('jwt_token', token, httponly=True, secure=False)
			return response
	except Exception as exc:
		return HttpResponse(exc)

def validate_qr(request):
	user = _user_jwt_cookie(request)
	user_code = request.POST.get('code')
	is_valid = True #validate_code(request)

	if is_valid:
		user.active_2FA = True
		user.save()
		return HttpResponse(f"Hello {user.username} , email {user.email}!")
	else:
		return twofa(request) 
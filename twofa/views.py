from django.shortcuts import render, HttpResponse
from API.models import Users
from API.views import add_user_API
from .forms import Form2FA
import pyotp
import qrcode

def create_qr_code(user):
	uri = pyotp.totp.TOTP(user.token_2FA).provisioning_uri(name=user.username, issuer_name="Pong App")
	img_url = f"twofa/static/QR_codes/{user.username}.png"
	qrcode.make(uri).save(img_url)

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

def twofa(request):
	try:
		#add user to db and return user of type Users
		user = add_user_API(request)
		if not (user.active_2FA):
			create_qr_code(user)

			form = create_2FA_form(request, user)
			qr_code = f'static/QR_codes/{user.username}.png'

			return render(request, 'first_login.html', {'form': form, 'qr_code': qr_code})
		return HttpResponse(f"Hello {user.username} , email {user.email}!")
	except Exception as exc:
		return HttpResponse(exc)

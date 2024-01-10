from django.shortcuts import render
from API.views import authenticate_42
from django.utils import translation
from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseNotFound
from django.conf import settings
from twofa.views import twofa, validate_2fa, qr_setup, email_setup, delete_jwt, _jwt_is_expired, _user_jwt_cookie
from game.views import game_setup

def spa_view(request):
	try:
		section = request.resolver_match.url_name

		if (
			section != "game"
			and section != "tournament"
			and section != "validate_2fa_code"
			and section != "twofa"
			and section != "qr_setup"
			and section != "email_setup"
		):
			section = "main"

		context = {
			"section": section + ".html",
		}

		if section == "validate_2fa_code":
			context, token = validate_2fa(request)
		if section == "twofa":
			context, token = twofa(request)
		if section == "qr_setup":
			context, token = qr_setup(request)
		if section == "email_setup":
			context, token = email_setup(request)
		if section == "game":
			context = game_setup(request, context)

		if section == "main":
			jwt_token = request.COOKIES.get('jwt_token')
			if jwt_token is not None and not _jwt_is_expired(jwt_token):
				user = _user_jwt_cookie(request)
				if user.validated_2fa:
					context, token = loged_page(request, user)
					section = "temporal_loggedin"

	except Exception as exc:
		context = {
			"error_msg": exc,
			"section": "error_page.html"
		}
		token = None
	
	res = render(request, "spa.html", context)

	if section == "twofa" or section == "validate_2fa_code" \
		or section == "qr_setup" or section == "sms_setup" \
		or section == "email_setup" or section == "temporal_loggedin" :
		res.set_cookie("jwt_token", token, httponly=True, secure=False)
	return res

def spa_view_catchall(request, catchall):
	context = {
		"section": "main.html",
	}
	return render(request, "spa.html", context)


def main_view(request):
	return render(request, "main.html")


def game_view(request):
	context = game_setup(request, {})
	return render(request, "game.html", context)


def tournament_view(request):
	return render(request, "tournament.html")

def api_view(request):
	return(authenticate_42(request))

def validate_2fa_code(request):
	return(validate_2fa(request))

def set_language(request, language_code):
	if translation.check_for_language(language_code):
		translation.activate(language_code)
		renderizado = spa_view(request)
		renderizado.set_cookie(settings.LANGUAGE_COOKIE_NAME, language_code)
		return renderizado
	else:
		return HttpResponseNotFound()

def logout_view(request):
	delete_jwt(request)
	response = render(request, "main.html")
	response.delete_cookie("jwt_token")
	return response

def loged_page(request, user):
	return {
		"username": user.username,
		"email": user.email,
		"section": "temporal_loggedin.html",
	}, request.COOKIES.get('jwt_token')
from django.shortcuts import render
from API.views import authenticate_42
from django.utils import translation
from django.conf import settings
from twofa.views import twofa, qr_setup, email_setup, delete_jwt, _jwt_is_expired, _user_jwt_cookie, get_validate_2fa
from game.views import game_setup
from game_settings.views import game_settings, get_game_settings
import logging

logger = logging.getLogger(__name__)


def spa_view(request):
	try:
		section = request.resolver_match.url_name
		logged_in, user = is_logged_in(request)

		if (
			section != "game"
			and section != "game_settings"
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


		if section == "validate_2fa_code" and logged_in:
			section = "temporal_loggedin"
		elif section == "validate_2fa_code" and not logged_in:
			context, token = get_validate_2fa(request)
		elif section == "twofa":
			context, token, language = twofa(request)
		elif section == "qr_setup":
			context, token = qr_setup(request)
		elif section == "email_setup":
			context, token = email_setup(request)
		elif section == "game_settings" and logged_in:
			context = game_settings(request)
		elif section == "game" and logged_in:
			context = game_setup(request, context, user)
			logger.info(f"game: {user.username}")
		if section == "tournament" and logged_in:
			logger.info(f"tournament: {user.username}")
		if section == "main" and logged_in:
			context, token = logged_page(request, user)
			section = "temporal_loggedin"

	except Exception as exc:
		context = {
			"error_msg": exc,
			"section": "error_page.html"
		}
		token = None

	if section == "twofa" and translation.check_for_language(language):
		translation.activate(language)

	res = render(request, "spa.html", context)

	if section == "twofa" or section == "validate_2fa_code" \
		or section == "qr_setup" or section == "sms_setup" \
		or section == "email_setup" or section == "temporal_loggedin" :
		res.set_cookie("jwt_token", token, httponly=True, secure=False)
	if section == "twofa":
		res.set_cookie(settings.LANGUAGE_COOKIE_NAME, language)
	return res

def is_logged_in(request):
	jwt_token = request.COOKIES.get('jwt_token')
	user = None
	if jwt_token is not None and not _jwt_is_expired(jwt_token):
		user = _user_jwt_cookie(request)
		if user is not None and user.validated_2fa:
			return True, user
	return False, user

def spa_view_catchall(request, catchall):
	context = {
		"section": "main.html",
	}
	return render(request, "spa.html", context)

def main_view(request):
	return render(request, "main.html")

def welcome_view(request):
	logged_in, user = is_logged_in(request)

	context = {
		"username": user.username,
	}
	return render(request, "temporal_loggedin.html", context)

def game_view(request):
	if not is_logged_in(request)[0]:
		return render(request, "main.html")
	logged_in, user = is_logged_in(request)
	
	logger.info(f"game: {user.username}")

	context = game_setup(request, {}, user)
	return render(request, "game.html", context)

def game_settings_view(request):
	if not is_logged_in(request)[0]:
		return render(request, "main.html")
	context = game_settings(request)
	return render(request, "game_settings.html", context)

def get_game_settings_view(request):
	return get_game_settings(request)

def tournament_view(request):
	if not is_logged_in(request)[0]:
		return render(request, "main.html")

	logged_in, user = is_logged_in(request)
	logger.info(f"tournament: {user.username}")

	return render(request, "tournament.html")

def api_view(request):
	return(authenticate_42(request))

def validate_2fa_code(request):
	return(get_validate_2fa(request))

def set_language(request, language_code):
	logger.info(f"language: {language_code}")
	if translation.check_for_language(language_code):
		translation.activate(language_code)
		renderizado = spa_view(request)
		renderizado.set_cookie(settings.LANGUAGE_COOKIE_NAME, language_code)
		logged_in, user = is_logged_in(request)
		if user is not None:
			user.language = language_code
			user.save()
		return renderizado
	else:
		return spa_view(request)

def logout_view(request):
	delete_jwt(request)
	response = render(request, "main.html")
	response.delete_cookie("jwt_token")
	return response

def logged_page(request, user):
	return {
		"username": user.username,
		"email": user.email,
		"section": "temporal_loggedin.html",
	}, request.COOKIES.get('jwt_token')
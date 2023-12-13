from django.shortcuts import render
from API.views import authenticate_42
from twofa.views import twofa, validate_2fa, validate_user
from django.utils import translation
from django.shortcuts import redirect
from django.http import HttpResponseNotFound
from django.conf import settings
from twofa.views import twofa, validate_2fa, validate_user, qr_setup, email_setup
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


    except Exception as exc:
        context = {
            "error_msg": exc,
            "section": "error_page.html"
        }
        token = None
    
    res = render(request, "spa.html", context)

    if section == "twofa" or section == "validate_2fa_code" \
        or section == "qr_setup" or section == "sms_setup" \
        or section == "email_setup":
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
    # if not validate_user(request):
    #     return render(request, "main.html")
    context = game_setup(request)
    return render(request, "game.html", context)


def tournament_view(request):
    # if not validate_user(request):
    #     return render(request, "main.html")
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

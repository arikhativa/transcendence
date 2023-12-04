from django.shortcuts import render
from API.views import authenticate_42
from twofa.views import twofa, validate_2fa, validate_user, qr_setup, email_setup

def spa_view(request):
    try:
        section = request.resolver_match.url_name
        if (
            section != "game"
            and section != "tournament"
            and section != "validate_2fa_code"
            and section != "twofa"
            and section != "qr_setup"
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

    except Exception as exc:
        context = {
            "error_msg": exc,
            "section": "error_page.html"
        }
        token = None

    res = render(request, "spa.html", context)

    if section == "twofa" or section == "validate_2fa_code" \
        or section == "qr_setup":
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
    if not validate_user(request):
        return render(request, "main.html")
    return render(request, "game.html")


def tournament_view(request):
    if not validate_user(request):
        return render(request, "main.html")
    return render(request, "tournament.html")

def api_view(request):
    return(authenticate_42(request))

def validate_2fa_code(request):
    return(validate_2fa(request))

def email_setup_view(request):
    return(email_setup(request))
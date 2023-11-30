from django.shortcuts import render
from API.views import authenticate_42
from twofa.views import twofa, validate_2fa, validate_user
from django.template.loader import render_to_string

def spa_view(request):
    section = request.resolver_match.url_name
    if (
        section != "game"
        and section != "tournament"
        and section != "validate_2fa_code"
        and section != "twofa"
    ):
        section = "main"

    context = {
        "section": section + ".html",
    }

    if section == "validate_2fa_code":
        context, token = validate_2fa(request)
    if section == "twofa":
        context, token = twofa(request)


    res = render(request, "spa.html", context)

    if section == "twofa":
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
    if not validate_user(request) :
        return render(request, "main.html")
    return render(request, "game.html")


def tournament_view(request):
    if not validate_user(request):
        return render(request, "main.html")
    return render(request, "tournament.html")

def twofa_view(request):
    return(twofa(request))

def api_view(request):
    return(authenticate_42(request))


def validate_2fa_code(request):
    return(validate_2fa(request))
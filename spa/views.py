from django.shortcuts import render
from API.views import authenticate_42
from twofa.views import twofa, validate_qr, validate_user


def spa_view(request):
    section = request.resolver_match.url_name
    if (
        section != "game"
        and section != "tournament"
        and section != "validate_qr_code"
        and section != "twofa"
    ):
        section = "main"

    context = {
        "section": section + ".html",
    }

    return render(request, "spa.html", context)


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


def twofa_view(request):
    return twofa(request)


def api_view(request):
    return authenticate_42(request)


def validate_qr_code(request):
    return validate_qr(request)

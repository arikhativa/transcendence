from django.shortcuts import render
from django.http import HttpResponse
from API.views import authenticate_42
from twofa.views import twofa, validate_qr
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


def spa_view(request):
    section = request.resolver_match.url_name
    if section != "game" and section != "tournament":
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_view(request):
    return render(request, "game.html")


def tournament_view(request):
    return render(request, "tournament.html")

def twofa_view(request):
    return(twofa(request))

def api_view(request):
    return(authenticate_42(request))


def validate_qr_code(request):
    return(validate_qr(request))
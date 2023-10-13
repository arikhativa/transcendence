from django.shortcuts import render


def spa_view(request):
    return render(request, "spa/spa.html")


def main_view(request):
    return render(request, "main/main.html")


def game_view(request):
    return render(request, "game/game.html")


def tournament_view(request):
    return render(request, "tournament/tournament.html")

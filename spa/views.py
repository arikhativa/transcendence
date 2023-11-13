from django.shortcuts import render


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


def game_view(request):
    return render(request, "game.html")


def tournament_view(request):
    return render(request, "tournament.html")

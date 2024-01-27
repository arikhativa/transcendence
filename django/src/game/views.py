from django.shortcuts import render

def game_setup(request, context, user):
    players = request.GET.urlencode()
    if len(players) < 200:
        context['players'] = players
    context['username'] = user.username
    return context
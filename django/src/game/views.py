from django.shortcuts import render

def game_setup(request, context, user):
    players = request.GET.urlencode()
    context['players'] = players
    context['username'] = user.username
    return context
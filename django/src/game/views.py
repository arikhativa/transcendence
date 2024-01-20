from django.shortcuts import render

def game_setup(request, context={}):
    players = request.GET.urlencode()
    context['players'] = players
    return context
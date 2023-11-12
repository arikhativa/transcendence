from django.urls import path
from . import views

urlpatterns = [
    path("tournament/", views.tournament_view, name="tournament"),
    path("game/", views.game_view, name="game"),
    path("main/", views.main_view, name="main"),
    path("", views.spa_view, name="spa"),
]

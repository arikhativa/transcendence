from django.urls import path
from . import views

urlpatterns = [
    path("section/tournament/", views.tournament_view, name="tournament"),
    path("section/game/", views.game_view, name="game"),
    path("section/home/", views.home_view, name="home"),
    path("section/main/", views.main_view, name="main"),

    path("game/", views.spa_view, name="game"),
    path("home/", views.spa_view, name="home"),
    path("tournament/", views.spa_view, name="tournament"),
    path("main/", views.spa_view, name="main"),
    path("menu/", views.spa_view, name="menu"),
    path("", views.spa_view, name="spa"),

    path("<path:catchall>", views.spa_view_catchall, name="spa"),
]

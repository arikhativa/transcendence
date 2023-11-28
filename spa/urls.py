from django.urls import path
from . import views

urlpatterns = [
    path("section/tournament/", views.tournament_view, name="tournament"),
    path("section/game/", views.game_view, name="game"),
    path("section/main/", views.main_view, name="main"),
    path("section/twofa/", views.twofa_view, name="twofa"),
    path("section/validate_qr_code/", views.validate_qr_code, name="validate_qr_code"),
    path("game/", views.spa_view, name="game"),
    path("main/", views.spa_view, name="main"),
    path("API/authenticate_42", views.api_view, name="api"),
    path("twofa", views.spa_view, name="twofa"),
    path("", views.spa_view, name="spa"),
    path('validate_qr_code/', views.spa_view, name='validate_qr_code'),




    
    path("<path:catchall>", views.spa_view_catchall, name="spa"),
   
]

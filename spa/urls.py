from django.urls import path
from . import views

urlpatterns = [
    # these are to load section only
    path("section/tournament/", views.tournament_view, name="tournament"),
    path("section/game/", views.game_view, name="game"),
    path("section/main/", views.main_view, name="main"),
    path("section/validate_2fa_code/", views.validate_2fa_code, name="validate_2fa_code"),
    path("section/logout/", views.logout_view, name="logout"),
    # these are to ALL of the page
    path("", views.spa_view, name="spa"),
    path("main/", views.spa_view, name="main"),
    path("game/", views.spa_view, name="game"),
    path("tournament/", views.spa_view, name="tournament"),
    path("twofa", views.spa_view, name="twofa"),
    path("API/authenticate_42", views.api_view, name="api"),
    path("twofa/qr_setup", views.spa_view, name="qr_setup"),
    path("twofa/email_setup", views.spa_view, name="email_setup"),
    path("validate_2fa_code/", views.spa_view, name="validate_2fa_code"),
    path('set-language/<str:language_code>/', views.set_language, name='set_language'),
    path("<path:catchall>", views.spa_view_catchall, name="spa"),
]

from django.urls import path
from . import views
from game_settings import views as game_settings_views
from twofa import views as twofa_views

urlpatterns = [
    # these are to load section only
    path("section/tournament/", views.tournament_view, name="tournament"),
    path("section/game/", views.game_view, name="game"),
	path("section/game_settings/", views.game_settings_view, name="game_settings"),
    path("section/main/", views.main_view, name="main"),
    path("section/validate_2fa_code/", views.validate_2fa_code, name="validate_2fa_code"),
    path("section/logout/", views.logout_view, name="logout"),
    path("section/welcome_view/", views.welcome_view, name="welcome_view"),
    path("section/qr_setup/", twofa_views.get_qr_setup, name="qr_setup"),
    path("section/email_setup/", twofa_views.get_email_setup, name="email_setup"),
    path("section/twofa/", twofa_views.get_twofa, name="twofa"),
    # these are to ALL of the page
    path("", views.spa_view, name="spa"),
    path("main/", views.spa_view, name="main"),
    path("game/", views.spa_view, name="game"),
	path("game_settings/", views.spa_view, name="game_settings"),
    path("get_game_settings/", views.get_game_settings_view, name="get_game_settings"),
    path("tournament/", views.spa_view, name="tournament"),
    path("twofa", views.spa_view, name="twofa"),
    path("API/authenticate_42", views.api_view, name="api"),
    path("qr_setup/", views.spa_view, name="qr_setup"),
    path("email_setup/", views.spa_view, name="email_setup"),
    path("validate_2fa_code/", views.spa_view, name="validate_2fa_code"),
    path("post_game_settings/", game_settings_views.post_game_settings, name="post_game_settings"),
    path("welcome_view/", views.spa_view, name="welcome_view"),
    path("post_twofa_code/", twofa_views.post_twofa_code, name="post_twofa_code"),
    path('set-language/<str:language_code>/', views.set_language, name='set_language'),
    path("<path:catchall>", views.spa_view_catchall, name="spa"),
]

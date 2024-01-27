from twofa.views import _user_jwt_cookie
from django.views.decorators.csrf import csrf_protect
from django.utils.translation import gettext as _
from django.http import JsonResponse
from . import forms

def is_valid_input(form):
	bonus = form.get('bonus')
	walls = form.get('walls')
	player1_color = form.get('player1')
	player2_color = form.get('player2')
	ball_color = form.get('ballColor')
	ball_speed = form.get('ballSpeed')

	# Validate the form data
	if not all([player1_color, player2_color, ball_color, ball_speed]):
		return False
	if bonus not in ['on', None] or walls not in ['on', None]:
		return False
	if not isinstance(player1_color, str) or player1_color.lower() not in ['white', 'red', 'green', 'blue']:
		return False
	if not isinstance(player2_color, str) or player2_color.lower() not in ['white', 'red', 'green', 'blue']:
		return False
	if not isinstance(ball_color, str) or ball_color.lower() not in ['white', 'red', 'green', 'blue']:
		return False
	try:
		if not 3 <= int(ball_speed) <= 10:
			return False
	except ValueError:
		return False
	return True
	

@csrf_protect
def game_settings(request):
	user = _user_jwt_cookie(request)
	bonus_switch_type = "flexSwitchCheckDefault"
	walls_switch_type = "flexSwitchCheckDefault"
	check_mode_bonus = ""
	check_mode_walls = ""
	player1_color = "white"
	player2_color = "white"
	ball_color = "white"
	ball_speed = 3
	color_translations = {
		"white": _("white"),
		"red": _("red"),
		"green": _("green"),
		"blue": _("blue"),
	}

	if user is not None:
		if request.method == 'POST':
			if is_valid_input(request.POST):
				save_game_settings(request, user)
			else:
				return {
					"section": "game_settings_error.html",
				}

		player1_color = user.player_1_color
		player2_color = user.player_2_color
		ball_color = user.ball_color
		ball_speed = user.ball_speed

		if user.bonus:
			bonus_switch_type = "flexSwitchCheckChecked"
			check_mode_bonus = "checked"
		if user.walls:
			walls_switch_type = "flexSwitchCheckChecked"
			check_mode_walls = "checked"

	return {
		"switch_type_bonus": bonus_switch_type,
		"switch_type_walls": walls_switch_type,
		"check_mode_bonus": check_mode_bonus,
		"check_mode_walls": check_mode_walls,
		"player1_color": player1_color,
		"player2_color": player2_color,
		"ball_color": ball_color,
		"ball_speed": ball_speed,
		"color_list": ["white", "red", "green", "blue"],
		"color_translations": color_translations,
		"section": "game_settings.html",
	}

def save_game_settings(request, user):
	if user is not None:
		if request.POST.get('bonus') is not None:
			user.bonus = True
		else:
			user.bonus = False
		if request.POST.get('walls') is not None:
			user.walls = True
		else:
			user.walls = False
		user.player_1_color = request.POST.get('player1')
		user.player_2_color = request.POST.get('player2')
		user.ball_color = request.POST.get('ballColor')
		user.ball_speed = request.POST.get('ballSpeed')
		user.save()

def get_game_settings(request):
	user = _user_jwt_cookie(request)
	user_settings = {
		"bonus": False,
		"walls": False,
		"player1_color": "white",
		"player2_color": "white",
		"ball_color": "white",
		"ball_speed": 3,
	}

	if user is not None:
		user_settings["bonus"] = user.bonus
		user_settings["walls"] = user.walls
		user_settings["player1_color"] = user.player_1_color
		user_settings["player2_color"] = user.player_2_color
		user_settings["ball_color"] = user.ball_color
		user_settings["ball_speed"] = user.ball_speed
	
	return JsonResponse(user_settings)
	
	
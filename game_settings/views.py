from twofa.views import _user_jwt_cookie
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def game_settings(request):
	user = _user_jwt_cookie(request)
	bonus_switch_type = "flexSwitchCheckDefault"
	walls_switch_type = "flexSwitchCheckDefault"
	check_mode_bonus = ""
	check_mode_walls = ""
	player1_white_selected = ""
	player1_red_selected = ""
	player1_green_selected = ""
	player1_blue_selected = ""
	player2_white_selected = ""
	player2_red_selected = ""
	player2_green_selected = ""
	player2_blue_selected = ""

	if request.method == 'POST':
		save_game_settings(request, user)

	if user is not None:
		if user.bonus:
			bonus_switch_type = "flexSwitchCheckChecked"
			check_mode_bonus = "checked"
		if user.walls:
			walls_switch_type = "flexSwitchCheckChecked"
			check_mode_walls = "checked"

		if user.player_1_color == "white":
			player1_white_selected = "selected"
		elif user.player_1_color == "red":
			player1_red_selected = "selected"
		elif user.player_1_color == "green":
			player1_green_selected = "selected"
		elif user.player_1_color == "blue":
			player1_blue_selected = "selected"
		
		if user.player_2_color == "white":
			player2_white_selected = "selected"
		elif user.player_2_color == "red":
			player2_red_selected = "selected"
		elif user.player_2_color == "green":
			player2_green_selected = "selected"
		elif user.player_2_color == "blue":
			player2_blue_selected = "selected"

	return {
		"switch_type_bonus": bonus_switch_type,
		"switch_type_walls": walls_switch_type,
		"check_mode_bonus": check_mode_bonus,
		"check_mode_walls": check_mode_walls,
		"player1_white_selected": player1_white_selected,
		"player1_red_selected": player1_red_selected,
		"player1_green_selected": player1_green_selected,
		"player1_blue_selected": player1_blue_selected,
		"player2_white_selected": player2_white_selected,
		"player2_red_selected": player2_red_selected,
		"player2_green_selected": player2_green_selected,
		"player2_blue_selected": player2_blue_selected,
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
		user.save()
	
	
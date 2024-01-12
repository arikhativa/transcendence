from twofa.views import _user_jwt_cookie
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def game_settings(request):
	user = _user_jwt_cookie(request)
	bonus_switch_type = "flexSwitchCheckDefault"
	walls_switch_type = "flexSwitchCheckDefault"
	check_mode_bonus = ""
	check_mode_walls = ""

	if request.method == 'POST':
		save_game_settings(request, user)

	if user is not None:
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
		user.save()
	
	
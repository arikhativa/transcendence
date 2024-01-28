function getCookieValue(cookieName)
{
    const regex = new RegExp(`(^| )${cookieName}=([^;]+)`)
    const cookie = document.cookie.match(regex)

    if (cookie)
        return cookie[2]
	return null
}

export function translateGameText(textToTranslate) {
	let language = getCookieValue('django_language');
	if (language === null || language !== 'en' && language !== 'es' && language !== 'fr' && language !== 'he')
		language = 'en';

	// Add any translations here:
	const translations = {
		'en': {
			'SPACE_TO_START': 'Press space to start!',
			'SPACE_TO_CONTINUE': 'Press space to continue!',
			'WON_MATCH': ' won the match!',
			'WON_TOURNAMENT': ' won the tournament!',
			'PLAYER_ALREADY': 'Player already in tournament',
			'MAX_CHAR': 'Username cant be longer then 8',
			'USERNAME_EMPTY': 'Username field must not be empty',
		},
		'es': {
			'SPACE_TO_START': 'Presiona espacio para comenzar!',
			'SPACE_TO_CONTINUE': 'Presiona espacio para continuar!',
			'WON_MATCH': ' ganó la partida!',
			'WON_TOURNAMENT': ' ganó el torneo!',
			'PLAYER_ALREADY': 'Jugador ya en torneo',
			'MAX_CHAR': 'El nombre de usuario no puede ser mayor que 8',
			'USERNAME_EMPTY': 'El campo de nombre de usuario no debe estar vacío',
		},
		'fr': {
			'SPACE_TO_START': 'Appuyez sur espace pour commencer!',
			'SPACE_TO_CONTINUE': 'Appuyez sur espace pour continuer!',
			'WON_MATCH': ' a gagné le match!',
			'WON_TOURNAMENT': ' a gagné le tournoi!',
			'PLAYER_ALREADY': 'Joueur déjà en tournoi',
			'MAX_CHAR': "Le nom d'utilisateur ne peut pas dépasser 8",
			'USERNAME_EMPTY': "Le champ du nom d'utilisateur ne doit pas être vide",
		},
		'he': {
			'SPACE_TO_START': 'לחץ על רווח כדי להתחיל!',
			'SPACE_TO_CONTINUE': 'לחץ על רווח כדי להמשיך!',
			'WON_MATCH': ' ניצח את המשחק!',
			'WON_TOURNAMENT': ' ניצח את הטורניר!',
			'PLAYER_ALREADY': 'שחקן כבר בטורניר',
			'MAX_CHAR': 'שם המשתמש לא יכול להיות ארוך מ-8',
			'USERNAME_EMPTY': 'שדה שם משתמש לא יכול להיות ריק',
		}
	};

	return translations[language][textToTranslate];
}
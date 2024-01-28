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
			'SMALL_CANVAS': 'Canvas is too small!',
		},
		'es': {
			'SPACE_TO_START': 'Presiona espacio para comenzar!',
			'SPACE_TO_CONTINUE': 'Presiona espacio para continuar!',
			'WON_MATCH': ' ganó la partida!',
			'WON_TOURNAMENT': ' ganó el torneo!',
			'SMALL_CANVAS': 'El canvas es demasiado pequeño!',
		},
		'fr': {
			'SPACE_TO_START': 'Appuyez sur espace pour commencer!',
			'SPACE_TO_CONTINUE': 'Appuyez sur espace pour continuer!',
			'WON_MATCH': ' a gagné le match!',
			'WON_TOURNAMENT': ' a gagné le tournoi!',
			'SMALL_CANVAS': 'Le canvas est trop petit!',
		},
		'he': {
			'SPACE_TO_START': 'לחץ על רווח כדי להתחיל!',
			'SPACE_TO_CONTINUE': 'לחץ על רווח כדי להמשיך!',
			'WON_MATCH': ' ניצח את המשחק!',
			'WON_TOURNAMENT': ' ניצח את הטורניר!',
			'SMALL_CANVAS': 'הקנבס קטן מדי!',
		}
	};

	return translations[language][textToTranslate];
}
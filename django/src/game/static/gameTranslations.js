function getCookieValue(cookieName)
{
    const regex = new RegExp(`(^| )${cookieName}=([^;]+)`)
    const cookie = document.cookie.match(regex)

    if (cookie)
        return cookie[2]
	return null
}

export function translateGameText(textToTranslate) {
	const language = getCookieValue('django_language');

	// Add any translations here:
	const translations = {
		'en': {
			'Press space to start!': 'Press space to start!',
			'Press space to continue!': 'Press space to continue!',
			' won the match!': ' won the match!',
			' won the tournament!': ' won the tournament!',
		},
		'es': {
			'Press space to start!': 'Presiona espacio para comenzar!',
			'Press space to continue!': 'Presiona espacio para continuar!',
			' won the match!': ' ganó la partida!',
			' won the tournament!': ' ganó el torneo!',
		},
		'fr': {
			'Press space to start!': 'Appuyez sur espace pour commencer!',
			'Press space to continue!': 'Appuyez sur espace pour continuer!',
			' won the match!': ' a gagné le match!',
			' won the tournament!': ' a gagné le tournoi!',
		},
		'he': {
			'Press space to start!': 'לחץ על רווח כדי להתחיל!',
			'Press space to continue!': 'לחץ על רווח כדי להמשיך!',
			' won the match!': ' ניצח את המשחק!',
			' won the tournament!': ' ניצח את הטורניר!',
		}
	};

	return translations[language][textToTranslate];
}
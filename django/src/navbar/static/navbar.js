import { translateGameText } from './gameTranslations.js';

async function readOppInput() {
    var errElem = document.getElementById('opponent-input-error');
    var elem = document.getElementById('opponent-name-input');
	
	if (elem && elem.value)
	{
		if (elem.value.length > 8)
		{
			if (errElem)
			{
				errElem.innerText = translateGameText('OPPONENT_LONG');
				errElem.style["visibility"] =  "visible";
			}
			return ;
		}
		if (errElem)
			errElem.style["visibility"] =  "hidden";

		await showSection('game', {"players": elem.value}, true);
	}
	else
	{
		if (errElem)
			errElem.style["visibility"] =  "hidden";
		await showSection('game', undefined, true);
	}

    var canvas = document.getElementById('canvas');
	if (canvas)
		canvas.focus();
	else
		elem.focus();
}

var playButton = document.getElementById("play-btn");
playButton.onclick = readOppInput;
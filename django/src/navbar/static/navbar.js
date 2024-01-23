

async function readOppInput() {
    var elem = document.getElementById('opponent-name-input');
	
	if (elem && elem.value)
		await showSection('game', {"players": elem.value}, true);
	else 
		await showSection('game', undefined, true);

    var canvas = document.getElementById('canvas');
	if (canvas)
		canvas.focus();
	else
		elem.focus();
}

var playButton = document.getElementById("play-btn");
playButton.onclick = readOppInput;
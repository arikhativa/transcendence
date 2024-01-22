
function readOppInput() {
    var elem = document.getElementById('opponent-name-input');

	if (elem && elem.value)
	{
		showSection('game', {"players": elem.value});
	}
	showSection('game');
}

var playButton = document.getElementById("play-btn");
playButton.onclick = readOppInput;
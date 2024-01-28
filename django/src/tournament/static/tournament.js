var players = document.getElementById('tournament-players');

async function getTournamentPlayers() {
    const playerList = [];
    var names = players.getElementsByTagName('li');
    for (var i = 0; i < names.length; i++) {
        playerList.push(names[i].innerText);
    }
    return await showSection('game', {"players": playerList}, true);
}

function playerExists(name) {
    var names = players.getElementsByTagName('li');
    for (var i = 0; i < names.length; i++) {
        if (names[i].getAttribute('id') === name) {
            return true;
        }
    }
    return false;
}

var tournamentStartButton = document.getElementById('tournament-start-button');
tournamentStartButton.onclick = getTournamentPlayers;

function removePlayer() {
    players.removeChild(this);

    // Update num of players on HTML
    var numOfPlayers = document.getElementById('num-of-players');
    numOfPlayers.textContent = parseInt(numOfPlayers.textContent) - 1;
}

// Add new Players using button
function addNewPlayer() {
    var errElem = document.getElementById('input-error');

    var numOfPlayers = players.getElementsByTagName('li').length;
    if (numOfPlayers >= 16) {
		errElem.innerText = "Can not add more players!";
		errElem.style["visibility"] =  "visible";
        return ;
    }

    // Get name from text form
    // Get the value from the text input field
    var newPlayerName = document.getElementById('new-player-name').value.trim();

    // Username field must not be empty
    if (newPlayerName.trim().length === 0) {
		errElem.innerText = "Username field must not be empty";
		errElem.style["visibility"] =  "visible";
        return ;
    }

    if (newPlayerName.trim().length > 8) {
		errElem.innerText = "Username cant be longer then 8";
		errElem.style["visibility"] =  "visible";
        return ;
    }

    // Check if Player already in list
    if (playerExists(newPlayerName)) {
		errElem.innerText = "Player already in tournament";
		errElem.style["visibility"] =  "visible";
        return ;
    }

    // Create a new list item element
    var newPlayer = document.createElement('li');
    newPlayer.innerText = newPlayerName;
    newPlayer.classList.add('list-group-item');
    newPlayer.classList.add('list-group-item-warning');
    newPlayer.classList.add('text-center');
    newPlayer.setAttribute("id", newPlayerName);
    newPlayer.setAttribute("type", "submit");
    newPlayer.onclick = removePlayer;
    
    // Update num of players on HTML
    var numOfPlayers = document.getElementById('num-of-players');
    numOfPlayers.textContent = parseInt(numOfPlayers.textContent) + 1;

    // Append the new item to the list
    players.insertBefore(newPlayer, players.firstElementChild);
    // players.appendChild(newPlayer);
	errElem.style["visibility"] =  "hidden";
}

// Get the reference to the button element
var playerSubmitButton = document.getElementById('player-submit-button');
// Add the handleClick function to the button's onclick event
playerSubmitButton.onclick = addNewPlayer;
 // Enable form submission on Enter key press
 document.getElementById('new-player-name').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        addNewPlayer();
    document.getElementById('new-player-name').value = '';
    }
});
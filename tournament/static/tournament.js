var players = document.getElementById('tournament-players');

function playerExists(name) {
    var names = players.getElementsByTagName('li');
    for (var i = 0; i < names.length; i++) {
        console.log(names[i].innerText);
        if (names[i].getAttribute('id') === name) {
            return true;
        }
    }
    return false;
}

function getTournamentPlayers() {
    // Get list of player on turnament
    // Log the entire list to the console
    // // Loop through the list items and log each item
    var names = players.getElementsByTagName('li');
    for (var i = 0; i < names.length; i++) {
        console.log(names[i].innerText);
    }
}
var tournamentStartButton = document.getElementById('tournament-start-button');
tournamentStartButton.onclick = getTournamentPlayers;

function removePlayer() {
    console.log(this);
    console.log("Player ", this.textContent, "was deleted.");
    players.removeChild(this);
}

// Add new Players using button
function addNewPlayer() {
    var numOfPlayers = players.getElementsByTagName('li').length;
    if (numOfPlayers >= 32) {
        console.log("Can not add more players!");
        return ;
    }

    // Get name from text form
    // Get the value from the text input field
    var newPlayerName = document.getElementById('new-player-name').value;
    // Username field must not be empty
    if (newPlayerName.trim().length === 0) {
        console.log("Username field must not be empty");
        return ;
    }
    // Check if Player already in list
   
    if (playerExists(newPlayerName)) {
        console.log("Player already in tournament");
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
    console.log(numOfPlayers);
    numOfPlayers.textContent = parseInt(numOfPlayers.textContent) + 1;

    // Append the new item to the list
    players.appendChild(newPlayer);
    console.log("New player added");
}

// Get the reference to the button element
var playerSubmitButton = document.getElementById('player-submit-button');
// Add the handleClick function to the button's onclick event
playerSubmitButton.onclick = addNewPlayer;
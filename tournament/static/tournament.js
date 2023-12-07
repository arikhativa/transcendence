var players = document.getElementById('tournament-players');

function getTournamentPlayers() {
    // Get list of player on turnament
    // Log the entire list to the console
    // // Loop through the list items and log each item
    var names = players.getElementsByTagName('li');
    for (var i = 0; i < names.length; i++) {
        console.log(names[i].innerText);
    }
}

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

var tournamentStartButton = document.getElementById('tournament-start-button');
tournamentStartButton.onclick = getTournamentPlayers;

function removePlayer() {
    console.log(this);
    console.log("Player ", this.textContent, "was deleted.");
    players.removeChild(this);

    // Update num of players on HTML
    var numOfPlayers = document.getElementById('num-of-players');
    console.log(numOfPlayers);
    numOfPlayers.textContent = parseInt(numOfPlayers.textContent) - 1;
}

// Add new Players using button
function addNewPlayer() {
    var numOfPlayers = players.getElementsByTagName('li').length;
    if (numOfPlayers >= 16) {
        console.log("Can not add more players!");
        return ;
    }

    // Get name from text form
    // Get the value from the text input field
    var newPlayerName = document.getElementById('new-player-name').value.trim();
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
    players.insertBefore(newPlayer, players.firstElementChild);
    // players.appendChild(newPlayer);
    console.log("New player added");
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
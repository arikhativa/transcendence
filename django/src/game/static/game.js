import { GameController } from './GameController.js';
import { ScreenManager } from './ScreenManager.js';
import { Tournament } from './TournamentManager.js';

const usernameDataElement = document.getElementById('username-data');
const usernameDataString = usernameDataElement ? usernameDataElement.dataset.username : null;
const playersDataElement = document.getElementById('players-data');
const playersDataString = playersDataElement ? playersDataElement.dataset.players : null;
let playersList = [];

if (playersDataString) {

    const playersParam = new URLSearchParams(playersDataString).get('players');

    playersList = playersParam ? decodeURIComponent(playersParam).split(',') : [];
	if (playersList.length === 0)
	{
		playersList.push(usernameDataString);
		playersList.push("Player2");
	}
	if (playersList.length === 1)
	{
		playersList.unshift(usernameDataString);
	}
}
else {
	playersList.push(usernameDataString);
	playersList.push("Player2");
}

// Define canvas and a context to draw to
const canvas = document.getElementById("canvas");
setCanvasSize()
const ctx = canvas.getContext("2d");

//Game SETUP
let tournament;
let game;
let screenManager;

// Game.js
function setCanvasSize() {
	if (!canvas)
		return ;
    canvas.width = canvas.parentElement.parentElement.clientWidth * 0.8;
    canvas.height = canvas.parentElement.parentElement.clientHeight * 0.8;
}

function onResize() {
    setCanvasSize();
}

window.onresize = onResize;

// Input handler
function handleKeyPress(e, isKeyDown) {
    if (game.p1 == null || game.p2 == null)
        return ;
    game.p1.move_listener(e, isKeyDown);
    game.p2.move_listener(e, isKeyDown);
}

function setListeners()
{

window.addEventListener('keydown', (e) => {	
    handleKeyPress(e, true);	
});	
window.addEventListener('keyup', (e) => {	
    handleKeyPress(e, false);	
});	
window.addEventListener('keyup', (e) => {	
    if ((e.key !== " " && e.key !== "n" && e.key !== "N") || screenManager.transition)	
        return;	
    if (screenManager.currentScreen == screenManager.screens.GAME) {	
		// 'n' or 'N' will skip the match and chose p1 as winner	
		if (e.key === "n" || e.key === "N")	
		{	
			game.last_winner = game.p1;	
			game.winner_name = game.p1.name;	
			return ;	
		}	
        game.pause = !game.pause;	
        return ;	
    } else if (screenManager.currentScreen == screenManager.screens.INTRO) {	
        screenManager.nextScreen = screenManager.screens.TOURNAMENTTREE;	
    } else if (screenManager.currentScreen == screenManager.screens.VSSCREEN) {	
        screenManager.nextScreen = screenManager.screens.GAME;	
    } else if (screenManager.currentScreen == screenManager.screens.ENDOFMATCH) {	
        if (tournament.phaseChange)	
            screenManager.nextScreen = screenManager.screens.TOURNAMENTTREE	
        else	
            screenManager.nextScreen = screenManager.screens.VSSCREEN;	
    } else if (screenManager.currentScreen == screenManager.screens.TOURNAMENTTREE) {	
        screenManager.nextScreen = screenManager.screens.VSSCREEN;	
    } else if (screenManager.currentScreen == screenManager.screens.ENDOFTOURNAMENT) {	
        //TODO: reset tournament	
    }	
    //TODO: new screens can be added here if you want to switch screens using space	
    screenManager.transition = true;	
});	
document.addEventListener('keydown', handleKeyPress);

}


function gameLoop() {
    //Clear Canvas
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1;

	if (canvas)
	{
    	ctx.fillRect(0, 0, canvas.width, canvas.height);

		//Show screens
		screenManager.loop(ctx, canvas, game, tournament);
	}
    //Manage the torunament
    tournament.handler(game, screenManager);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

async function startGame() {
    const userSettings = await getGameSettings();
    const gameSettings = {
        barriers: userSettings.walls,
        ballSpeed: userSettings.ball_speed,
        bonus: userSettings.bonus,
        leftPlayerColor: userSettings.player1_color,
        rightPlayerColor: userSettings.player2_color,
        ballColor: userSettings.ball_color,
    }
    tournament = new Tournament(playersList);
    game = new GameController(tournament.nextMatch(), gameSettings);
    screenManager = new ScreenManager();

	setListeners();

    gameLoop();
}

if (document.readyState !== 'complete') {
    window.addEventListener("DOMContentLoaded", (event) => {
        startGame();
    });
}
else {
    startGame();
}

async function getGameSettings() {
    const response = await fetch('/get_game_settings/');
    const data = await response.json();
    return data;
}
import { GameController } from './GameController.js';
import { ScreenManager } from './ScreenManager.js';
import { Tournament } from './TournamentManager.js';

// Define canvas and a context to draw to
const canvas = document.getElementById("canvas");
setCanvasSize();
const ctx = canvas.getContext("2d");


window.onresize = onResize;

//Game SETUP
let tournament;
let game;
let screenManager;

// Gmaejs
function setCanvasSize() {
    canvas.width = canvas.parentElement.parentElement.clientWidth * 0.8;
    canvas.height = canvas.parentElement.parentElement.clientHeight * 0.8;
    //console.log(canvas.width, canvas.height);
}

function onResize() {
    setCanvasSize();
}

async function getGameSettings() {
    const response = await fetch('/get_game_settings/');
    const data = await response.json();
    return data;
}

// Input handler
function handleKeyPress(e, isKeyDown) {
    if (game.p1 == null || game.p2 == null)
        return ;
    game.p1.move_listener(e, isKeyDown);
    game.p2.move_listener(e, isKeyDown);
}

function gameLoop() {
    //Clear Canvas
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Show screens
    screenManager.loop(ctx, canvas, game, tournament);
    //Manage the torunament
    tournament.handler(game, screenManager);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

async function startGame() {
    const playersDataElement = document.getElementById('players-data');
    const playersDataString = playersDataElement ? playersDataElement.dataset.players : null;
    let playersList = [];

    if (playersDataString) {

        const playersParam = new URLSearchParams(playersDataString).get('players');
        
        playersList = playersParam ? decodeURIComponent(playersParam).split(',') : [];
    }


    const userSettings = await getGameSettings();
    const gameSettings = {
        barriers: userSettings.walls,
        ballSpeed: userSettings.ball_speed,
        bonus: userSettings.bonus,
        leftPlayerColor: userSettings.player1_color,
        rightPlayerColor: userSettings.player2_color,
        ballColor: userSettings.ball_color,
    }
    tournament = new Tournament();
    game = new GameController(tournament.nextMatch(), gameSettings);
    screenManager = new ScreenManager();


    window.addEventListener('keydown', (e) => {
        handleKeyPress(e, true);
    });
    window.addEventListener('keyup', (e) => {
        handleKeyPress(e, false);
    });
    window.addEventListener('keyup', (e) => {
        if (e.key !== " " || screenManager.transition)
            return;
        if (screenManager.currentScreen == screenManager.screens.GAME) {
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

    gameLoop();
}

if (document.readyState !== 'complete') {
    window.addEventListener("DOMContentLoaded", (event) => {
        console.log(event);
        console.log("DOM fully loaded and parsed");
        startGame();
    });
}
else {
    startGame();
}
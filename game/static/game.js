import { GameController } from './GameController.js';
import { ScreenManager } from './ScreenManager.js';
import { Tournament } from './TournamentManager.js';

const playersDataElement = document.getElementById('players-data');
const playersDataString = playersDataElement ? playersDataElement.dataset.players : null;

if (playersDataString) {

    const playersParam = new URLSearchParams(playersDataString).get('players');
    
    const playersArray = playersParam ? decodeURIComponent(playersParam).split(',') : [];
    
    console.log("playersArray", playersArray);
}


// Define canvas and a context to draw to
let canvas = document.getElementById("canvas");
setCanvasSize();
let ctx = canvas.getContext("2d");

// Gmaejs
function setCanvasSize() {
    canvas.width = canvas.parentElement.parentElement.clientWidth * 0.8;
    canvas.height = canvas.parentElement.parentElement.clientHeight * 0.8;
    // console.log(canvas.width, canvas.height);
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

//Game SETUP
let  tournament = new Tournament();
let  game = new GameController(tournament.nextMatch());

let screenManager = new ScreenManager();

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
gameLoop();
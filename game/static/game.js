import { Player } from './Player.js';
import { Ball } from './Ball.js';
import { Board } from './Board.js';
import { GameController } from './GameController.js';
import { Tournament } from './TournamentManager.js';

const screens = {
    INTRO: 0,
    GAME: 1,
    VSSCREEN: 2,
    ENDOFMATCH: 3,
    ENDOFTOURNAMENT: 4,
    TOURNAMENTTREE: 5
};
let transition = false;
let transitionSwitch = false;
let transitionPerc = 1;

let currentScreen = screens.INTRO;
let nextScreen = screens.GAME;
let phaseChange = false;

// Gmaejs
function setCanvasSize() {
    canvas.width = canvas.parentElement.clientWidth * 0.8;
    canvas.height = canvas.parentElement.clientHeight * 0.8;
    // console.log(canvas.width, canvas.height);
}
function onResize() {
    setCanvasSize();
}
window.onresize = onResize;

// Define canvas and a context to draw to
let canvas = document.getElementById("canvas");
setCanvasSize();
let ctx = canvas.getContext("2d");

// Input handler
function handleKeyPress(e, isKeyDown) {
    if (m == null)
        return ;
    m[0].obj.move_listener(e, isKeyDown);
    m[1].obj.move_listener(e, isKeyDown);
}
window.addEventListener('keydown', (e) => {
    handleKeyPress(e, true);
});
window.addEventListener('keyup', (e) => {
    handleKeyPress(e, false);
});
let test_game_pause = false;
window.addEventListener('keyup', (e) => {
    if (e.key !== " " || transition)
        return;
    if (currentScreen == screens.GAME) {
        test_game_pause = !test_game_pause;
        return ;
    } else if (currentScreen == screens.INTRO) {
        nextScreen = screens.TOURNAMENTTREE;
    } else if (currentScreen == screens.VSSCREEN) {
        nextScreen = screens.GAME;
    } else if (currentScreen == screens.ENDOFMATCH) {
        if (phaseChange)
            nextScreen = screens.TOURNAMENTTREE
        else
            nextScreen = screens.VSSCREEN;
    } else if (currentScreen == screens.TOURNAMENTTREE) {
        nextScreen = screens.VSSCREEN;
    } else if (currentScreen == screens.ENDOFTOURNAMENT) {
        //TODO reset tournament
    }
    transition = true;
});
document.addEventListener('keydown', handleKeyPress);

//Game SETUP
let b = new Ball(canvas.width/2, canvas.height/2);
let board = new Board(canvas.width, canvas.height);
let  tournament = new Tournament();
tournament.addPlayer("Alvaro");
tournament.addPlayer("Cristina");
tournament.addPlayer("Perico");
tournament.addPlayer("Paco");
tournament.addPlayer("Ramiro"); //Ramiro should win the first round by default
tournament.closeTournament();
tournament.list();
let m = tournament.nextMatch(); //Start tournament
let last_winner = null;
let  game = new GameController(board, b, m[0].obj, m[1].obj);

function gameLoop() {
    //Clear Canvas
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let t = Math.min(Math.max(parseFloat(transitionPerc), 0), 1);
    ctx.globalAlpha = t;

    //Draw game
    switch (currentScreen) {
        case screens.INTRO:
            introScreen();
            break;
        case screens.GAME:
            if (!transition && !test_game_pause)
                game.update();
            game.draw(ctx);
            break;
        case screens.VSSCREEN:
            vsScreen(m[0].obj.name, m[1].obj.name);
            break;
        case screens.ENDOFTOURNAMENT:
            endOfTournament();
            break;
        case screens.TOURNAMENTTREE:
            console.log("TREE");
            drawTournamentTree();
            break;
        case screens.ENDOFMATCH:
            endOfMatch();
            break;
    }
    handleTransition();
    if (!tournament.isFinished) {
        let winner = game.isWinner();
        if (winner != -1) {
            last_winner = m[winner];
            tournament.lastMatchWinner(m[winner]);
        }
        handleTournament();
    }
    // Request the next frame
    requestAnimationFrame(gameLoop);
}
gameLoop();

function introScreen() {
    // Clear the canvas to render new frame
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("PONG", canvas.width/2, canvas.height/2 - 70);
    ctx.fillText("Press space to start", canvas.width/2, canvas.height/2 + 100);
}

function vsScreen(p1, p2) {
    // Clear the canvas to render new frame
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(p1 + " VS " + p2, canvas.width/2, canvas.height/2 - 70);
}

function endOfTournament() {
    // Clear the canvas to render new frame
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(last_winner.obj.name + " won", canvas.width/2, canvas.height/2 - 70);
    ctx.fillText("the TOURNAMENT!", canvas.width/2, canvas.height/2 + 100);
}

function endOfMatch() {
    // Clear the canvas to render new frame
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(last_winner.obj.name + " won", canvas.width/2, canvas.height/2 - 70);
    ctx.fillText("the match!", canvas.width/2, canvas.height/2 + 100);
}

function handleTransition() {
    let fadeOutSpeed = 0.1;
    let fadeInSpeed = 0.1;
    // Handle transition
    if (transition) {
        if (!transitionSwitch)
            transitionPerc -= fadeOutSpeed;
        else {
            currentScreen = nextScreen;
            transitionPerc += fadeInSpeed;
        }
        if (transitionPerc <= -0.5) {
            transitionSwitch = !transitionSwitch;
        }
        if (transitionPerc >= 1) {
            transition = false;
            transitionPerc = 1;
            transitionSwitch = !transitionSwitch;
        }
    }
}

function handleTournament() {
    let m_tmp = tournament.nextMatch();
    if (m_tmp != null) {
        m = m_tmp;
        nextScreen = screens.ENDOFMATCH;
        transition = true;
        game = new GameController(board, b, m[0].obj, m[1].obj);
    }

    let phase = tournament.nextPhase();
    if (phase === true) {
        phaseChange = true;
    } else if (phase != null) {
        last_winner = phase;
        nextScreen = screens.ENDOFTOURNAMENT;
        transition = true;
    }
}

function drawTournamentTree() {
    phaseChange = false;
    let depth = tournament.maxDepth;
    let size = ((2**depth)/2 + 2);
    ctx.fillStyle = 'white';

    let tile_width = canvas.width / size;
    for (let i = 0; i < size/2; i++) {
        let ammount = 2**(depth - 1 - i);
        let tile_height = canvas.height / ammount;
        let h = tile_width * (9/18);
        for (let k = 0; k < ammount; k++) {
            let pos_left = [(i * tile_width) + tile_width/2, (k * tile_height) + tile_height/2];
            let pos_right = [((size - i - 1) * tile_width) + tile_width/2, (k * tile_height) + tile_height/2];
            //Player Boxes
            let h = tile_width / 2;
            ctx.shadowColor = "#d53";
            ctx.shadowBlur = 10;
            ctx.lineJoin = "round";
            ctx.lineWidth = 8;
            ctx.strokeStyle = "white";
            ctx.strokeRect(pos_left[0] - tile_width/2 + 10, pos_left[1] - h/2, tile_width - 20, h);
            ctx.strokeRect(pos_right[0] - tile_width/2 + 10, pos_right[1] - h/2, tile_width - 20, h);

            //Player Names
            ctx.fillStyle = 'white';
            ctx.font = "30px Arial";
            ctx.fillText("Player name", pos_right[0], pos_right[1] + 15);

            ctx.fillText("Player name", pos_left[0], pos_left[1] + 15);
            ctx.fillStyle = 'white';
        }
    }
}
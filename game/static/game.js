import { Player } from './Player.js'
import { Ball } from './Ball.js'
import { Board } from './Board.js'
import { GameController } from './GameController.js';

// Gmaejs
function setCanvasSize() {
    canvas.width = canvas.parentElement.clientWidth * 0.8;
    canvas.height = canvas.parentElement.clientHeight * 0.8;
    console.log(canvas.width, canvas.height);
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
    p.move_listener(e, isKeyDown);
    p1.move_listener(e, isKeyDown);
}
window.addEventListener('keydown', (e) => {
    handleKeyPress(e, true);
});
window.addEventListener('keyup', (e) => {
    handleKeyPress(e, false);
});
let test_game_pause = false;
window.addEventListener('keyup', (e) => {
	if (e.key == " ")
		test_game_pause = !test_game_pause;
});

//Setup
let p = new Player(30, canvas.height/2);
p.setControls({
    up: {state: false, keys: "wW"},
    down: {state: false, keys: "sS"}
});

let p1 = new Player(canvas.width - 30, canvas.height/2);
p1.setControls({
    up: {state: false, keys: "iI"},
    down: {state: false, keys: "kK"}
});

document.addEventListener('keydown', handleKeyPress);

let b = new Ball(canvas.width/2, canvas.height/2);

let board = new Board(canvas.width, canvas.height);

let  game = new GameController(board, b, p, p1);

// Loops
function draw() {
    // Clear the canvas to render new frame
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    game.draw(ctx);
}
function update() {
	if (test_game_pause)
    	game.update();
}
function gameLoop() {
    // Update game
    update();

    // Draw game
    draw();
  
    // Request the next frame
    requestAnimationFrame(gameLoop);
}
gameLoop();
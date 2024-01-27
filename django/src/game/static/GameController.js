import { Ball } from './Ball.js';
import { Board } from './Board.js';

export class GameController {
    // Constructor method
	constructor(players, settings) {
		this.pause = false;
		this.last_winner = null;
		this.winner_name = ""
		this.settings = settings

		this.rightPlayerColor = this.settings.rightPlayerColor;
		this.rightPlayerSpeed = 10;

		this.leftPlayerColor = this.settings.leftPlayerColor;
		this.leftPlayerSpeed = 10;

		this.setup();
		this.setPlayers(players);
	}

	setup() {
		if (canvas) {
			this.ball = new Ball(canvas.width/2, canvas.height/2, this.settings.ballSpeed, this.settings.ballColor);
			this.board = new Board(canvas.width, canvas.height, this.settings);
		}
	}

	setPlayers(m) {
		this.p1 = m[0]
		this.p1.setColor(this.leftPlayerColor);
		this.p1.setSpeed(this.leftPlayerSpeed);
		
		this.p2 = m[1]
		this.p2.setColor(this.rightPlayerColor);
		this.p2.setSpeed(this.rightPlayerSpeed);
		this.last_winner = null;
	}

    update() {
		this.p1.update(this.board);
		this.p2.update(this.board);
		this.ball.update();
		this.board.update(this.p1, this.p2, this.ball);

		this.checkWinner();
	}

	draw(ctx) {
		this.board.draw(ctx);
		this.p1.draw(ctx, this.board);
		this.p2.draw(ctx, this.board);
		this.ball.draw(ctx);
	}

	checkWinner() {
		if (this.p1.score == 3)
			this.last_winner = this.p1;
		else if (this.p2.score == 3)
			this.last_winner = this.p2;
		if (this.last_winner !== null)
			this.winner_name = this.last_winner.name;
	}

	onResize(canvas) {
		if (this.ball)
			this.ball.onResize(canvas.width/2, canvas.height/2);
		if (this.board)
			this.board.onResize(canvas.width, canvas.height);
		if (this.p1)
			this.p1.onResize(canvas);
		if (this.p2)
			this.p2.onResize(canvas);
	}
}
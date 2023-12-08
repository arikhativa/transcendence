import { Ball } from './Ball.js';
import { Board } from './Board.js';

export class GameController {
    // Constructor method
	constructor(players) {
		this.pause = false;
		this.last_winner = null;
		this.winner_name = ""

		this.setup();
		this.setPlayers(players);
	}

	setup() {
		this.ball = new Ball(canvas.width/2, canvas.height/2);
		this.board = new Board(canvas.width, canvas.height);
	}

	setPlayers(m) {
		this.p1 = m[0]
		this.p2 = m[1]
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
		if (this.p1.score == 5)
			this.last_winner = this.p1;
		else if (this.p2.score == 5)
			this.last_winner = this.p2;
		if (this.last_winner !== null)
			this.winner_name = this.last_winner.name;
	}
}
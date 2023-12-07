export class GameController {
    // Constructor method
	constructor(board, ball, p1, p2) {
		this.board = board;
		this.ball = ball;
		this.p1 = p1;
		this.p2 = p2;

		this.pause = false;
	}

    update() {
		this.p1.update(this.board);
		this.p2.update(this.board);
		this.ball.update();
		this.board.update(this.p1, this.p2, this.ball);
	}

	draw(ctx) {
		this.board.draw(ctx);
		this.p1.draw(ctx, this.board);
		this.p2.draw(ctx, this.board);
		this.ball.draw(ctx);
	}

	isWinner() {
		if (this.p1.score == 5)
			return 0;
		if (this.p2.score == 5)
			return 1;
		return -1;
	}
}
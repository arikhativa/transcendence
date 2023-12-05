export class GameController {
    // Constructor method
	constructor(board, ball, p1, p2) {
		this.board = board;
		this.ball = ball;
		this.p1 = p1;
		this.p1_score = 0;
		this.p2_score = 0;
		this.p2 = p2;
	}

    update() {
		this.p1.update(this.board);
		this.p2.update(this.board);
		this.ball.update();

		// -------------------------------------------------------------------------------------
		//Vertical Walls
		if (this.ball.y - this.ball.h/2 <= this.board.y - this.board.h/2 || this.ball.y + this.ball.h/2 >= this.board.y + this.board.h/2)
			this.ball.dir.y *= -1;
		//Goal Walls
		if (this.ball.x - this.ball.w/2 <= this.p1.x + this.p1.w/2 && !(this.ball.y > this.p1.y - this.p1.h/2 && this.ball.y < this.p1.y + this.p1.h/2))
		{
			this.ball.x = this.board.x;
			this.ball.y = this.board.y;
			this.p2_score++;
		}
		if (this.ball.x + this.ball.w/2 >= this.p2.x - this.p2.w/2 && !(this.ball.y > this.p2.y - this.p2.h/2 && this.ball.y < this.p2.y + this.p2.h/2))
		{
			this.ball.x = this.board.x;
			this.ball.y = this.board.y;
			this.p1_score++;
		}

		// Ball collision with Player1
		if (this.ball.x - this.ball.w/2 <= this.p1.x + this.p1.w/2 && (this.ball.y > this.p1.y - this.p1.h/2 && this.ball.y < this.p1.y + this.p1.h/2))
		{
			this.ball.dir.x *= -1;
			if (this.p1.dir)
				this.ball.dir.y = this.p1.dir;
		}
		// Ball collision with Player2
		if (this.ball.x + this.ball.w/2 >= this.p2.x - this.p2.w/2 && (this.ball.y > this.p2.y - this.p2.h/2 && this.ball.y < this.p2.y + this.p2.h/2))
		{
			this.ball.dir.x *= -1;
			if (this.p2.dir)
				this.ball.dir.y = this.p2.dir;
		}
		// -------------------------------------------------------------------------------------
	}

	draw(ctx) {
		this.board.draw(ctx);
		this.p1.draw(ctx);
		this.p2.draw(ctx);
		this.ball.draw(ctx);
	}

	isWinner() {
		if (this.p1_score == 5)
			return 0;
		if (this.p2_score == 5)
			return 1;
		return -1;
	}
}
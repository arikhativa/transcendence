export class Board {
    // Constructor method
    constructor(w, h, settings) {
        this.x = w/2
        this.y = h/2;
        this.w = w;
        this.h = h;

        this.goal_size = 45;
        this.goal_color = '#888888';
        this.goal =
        {
            p1: this.goal_size,
            p2: this.w - this.goal_size
        };
        this.settings = settings;

        if (this.settings.bonus) {
            this.bonus = {
                x: w/2 + Math.random() * w/4 - w/8,  // Random position in the middle of the board
                y: h/2 + Math.random() * h/4 - h/8,
                s: 40,  // Size of the bonus square
                active: true,  // Whether the bonus is active
				playerWithBonus: null // The player who has the bonus
            };
        }

        if (this.settings.barriers) {
            this.barriers = [];
            for (let i = 0; i < 5; i++) {  // Generate 10 random barriers
                let barrier = {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    w: 20,  // Fixed width for barriers
                    h: 40  // Fixed height for barriers
                };
                this.barriers.push(barrier);
            }
        }
    }

    update(p1, p2, ball) {
        //Vertical Walls
        if (ball.y - ball.h / 2 <= this.y - this.h / 2) {
            //Cuanto se ha salido la bola de la pared de arriba
            ball.y = (this.y - this.h / 2) + ball.h;
            ball.dir.y *= -1;
        }
        if (ball.y + ball.h / 2 >= this.y + this.h / 2) {
            //Cuanto se ha salido la bola de la pared de abajo
            ball.y = (this.y + this.h / 2) - ball.h;
            ball.dir.y *= -1;
        }
        //Goal Walls
        if (ball.x - ball.w / 2 <= p1.x + p1.w / 2 && !(ball.y > p1.y - p1.h / 2 && ball.y < p1.y + p1.h / 2)) {
            ball.x = this.x;
            ball.y = this.y;
            ball.generateRandomInitAngle();
            p2.score++;
			if (this.settings.bonus && this.bonus.playerWithBonus == p2)
            	p2.score++;
        }
        if (ball.x + ball.w / 2 >= p2.x - p2.w / 2 && !(ball.y > p2.y - p2.h / 2 && ball.y < p2.y + p2.h / 2)) {
            ball.x = this.x;
            ball.y = this.y;
            ball.generateRandomInitAngle();
            p1.score++;
			if (this.settings.bonus && this.bonus.playerWithBonus == p1)
            	p1.score++;
        }

        // Ball collision with Player1 | LEFT
        if (ball.nextStep().x - ball.w / 2 <= p1.x + p1.w / 2 && (ball.nextStep().y > p1.y - p1.h / 2 && ball.nextStep().y < p1.y + p1.h / 2)) {
            ball.angle = 0;
            let min = 2 * Math.PI - 3 * Math.PI / 9
            let max = 2 * Math.PI + 3 * Math.PI / 9
            ball.randomDeviation(min, max);
			ball.hitBy = p1;

            // ball.rotateBall(Math.PI);
            // ball.randomDeviation(0.9);
        }
        // Ball collision with Player2 | RIGHT
        if (ball.nextStep().x + ball.w / 2 >= p2.x - p2.w / 2 && (ball.nextStep().y > p2.y - p2.h / 2 && ball.nextStep().y < p2.y + p2.h / 2)) {
            ball.angle = 0;
            let min = Math.PI - 3 * Math.PI / 9
            let max = Math.PI + 3 * Math.PI / 9
            ball.randomDeviation(min, max);
			ball.hitBy = p2;
            // ball.rotateBall(Math.PI);
            // ball.randomDeviation(0.9);
        }

        // Barriers collision
        if (this.settings.barriers) {
            for (let barrier of this.barriers) {
                if (ball.x + ball.w/2 > barrier.x - barrier.w/2 && ball.x - ball.w/2 < barrier.x + barrier.w/2 &&
                    ball.y + ball.h/2 > barrier.y - barrier.h/2 && ball.y - ball.h/2 < barrier.y + barrier.h/2) {
                    // ball.dir.x *= -1 + (Math.random() - 0.5);
                    // ball.dir.y *= -1 + (Math.random() - 0.5);
                    ball.angle = 0;
                    let min = Math.PI - 3 * Math.PI / 9
                    let max = Math.PI + 3 * Math.PI / 9
                    ball.randomDeviation(min, max);
                }
            }
        }

        // Check for collision with the 2x bonus
        if (ball.hitBy != null && this.settings.bonus && this.bonus.active &&
			ball.x + ball.w/2 > this.bonus.x - this.bonus.s/2 &&
			ball.x - ball.w/2 < this.bonus.x + this.bonus.s/2 &&
			ball.y + ball.h/2 > this.bonus.y - this.bonus.s/2 &&
			ball.y - ball.h/2 < this.bonus.y + this.bonus.s/2) {
			this.bonus.active = false;
			if (ball.hitBy == p1)
				this.bonus.playerWithBonus = p1;
			else
				this.bonus.playerWithBonus = p2;
		}
        // -------------------------------------------------------------------------------------
    }

    draw(ctx) {
        ctx.lineWidth = 8;
        ctx.strokeStyle = "white";

        // Draw barriers
        if (this.settings.barriers) {
            ctx.fillStyle = 'green';
            for (let barrier of this.barriers) {
                ctx.fillRect(barrier.x - barrier.w/2, barrier.y - barrier.h/2, barrier.w, barrier.h);
            }
        }

		// Draw the 2x bonus
        if (this.settings.bonus && this.bonus.active) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.bonus.x - this.bonus.s/2, this.bonus.y - this.bonus.s/2, this.bonus.s, this.bonus.s);

            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText('2x', this.bonus.x, this.bonus.y);
        }   

        //Border
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.fillStyle = 'white';
        //Midline
        ctx.fillRect(this.w / 2 - 2, 0, 4, this.h);
        ctx.lineWidth = 4;
        //MidSquare
        ctx.strokeRect(this.w / 2 - 46, this.h / 2 - 46, 92, 92);

        ctx.fillStyle = this.goal_color;
        ctx.fillRect(0 + 4, 0 + 4, this.goal.p1 - 4, this.h - 8);
        ctx.fillRect(this.goal.p2, 0 + 4, this.goal_size - 4, this.h - 8);

    }

    onResize(w, h) {
        this.x = w / 2
        this.y = h / 2;
        this.w = w;
        this.h = h;
        this.goal =
        {
            p1: this.goal_size,
            p2: this.w - this.goal_size
        };
    }
}
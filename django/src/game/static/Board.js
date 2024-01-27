import { drawRectRounded } from './draw_helpers.js';

export class Board {
    // Constructor method
    constructor(w, h, settings) {
        this.x = w/2
        this.y = h/2;
        this.w = w;
        this.h = h;

        this.goal_size = 45;
        this.goal_color = '#2e2e2e';
        this.goal =
        {
            p1: this.goal_size,
            p2: this.w - this.goal_size
        };
        this.settings = settings;
        this.initModifiers();
    }

    initModifiers() {
        if (this.settings.bonus) {
            this.bonus = {
                x: this.w/2 + Math.random() * this.w/3 - this.w/6,  // Random position in the middle of the board
                y: this.h/2 + Math.random() * this.h/3 - this.h/6,
                s: 40,  // Size of the bonus square
                active: true,  // Whether the bonus is active
				playerWithBonus: null // The player who has the bonus
            };
        }

        if (this.settings.barriers) {
            this.barriers = [];
            let xBar = 9, yBar = 5
            for (let i = 0; i < (xBar * yBar); i++) {  // Generate 10 random barriers
                let xGrid = Math.floor(i / yBar);
                let yGrid = i % yBar;
                if (xGrid == 0 || yGrid == 0 || xGrid == 1 || xGrid == 8) continue;
                let barrier = {
                    x: xGrid * this.w / xBar,
                    y: yGrid * this.h / yBar,
                    w: 10,  // Fixed width for barriers
                    h: 80  // Fixed height for barriers
                };
                if (Math.random() < 0.25)
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
			if (this.settings.bonus && this.bonus.playerWithBonus == p2)
            {
                this.bonus.playerWithBonus = null;
                p2.score++;
            }
            p2.score++;
        }
        if (ball.x + ball.w / 2 >= p2.x - p2.w / 2 && !(ball.y > p2.y - p2.h / 2 && ball.y < p2.y + p2.h / 2)) {
            ball.x = this.x;
            ball.y = this.y;
            ball.generateRandomInitAngle();
            p1.score++;
			if (this.settings.bonus && this.bonus.playerWithBonus == p1)
            {
                this.bonus.playerWithBonus = null;
                p1.score++;
            }
        }

        // Ball collision with Player1 | LEFT
        if (ball.nextStep().x - ball.w / 2 <= p1.x + p1.w / 2 && (ball.nextStep().y > p1.y - p1.h / 2 && ball.nextStep().y < p1.y + p1.h / 2)) {
            ball.angle = 0;
            let min = 2 * Math.PI - 3 * Math.PI / 9;
            let max = 2 * Math.PI + 3 * Math.PI / 9;
            ball.randomDeviation(min, max);
			ball.hitBy = p1;
        }
        // Ball collision with Player2 | RIGHT
        if (ball.nextStep().x + ball.w / 2 >= p2.x - p2.w / 2 && (ball.nextStep().y > p2.y - p2.h / 2 && ball.nextStep().y < p2.y + p2.h / 2)) {
            ball.angle = 0;
            let min = Math.PI - 3 * Math.PI / 9
            let max = Math.PI + 3 * Math.PI / 9
            ball.randomDeviation(min, max);
			ball.hitBy = p2;
        }

        // Barriers collision
        if (this.settings.barriers) {
            for (let barrier of this.barriers) {
                if (ball.nextStep().x + ball.w/2 > barrier.x - barrier.w/2 && ball.nextStep().x - ball.w/2 < barrier.x + barrier.w/2 &&
                    ball.nextStep().y + ball.h/2 > barrier.y - barrier.h/2 && ball.nextStep().y - ball.h/2 < barrier.y + barrier.h/2) {
                    ball.angle = 0;
                    let min = 0, max = 0;
                    if (ball.dir.x < 0) //Izquierda
                    {
                        min = 2 * Math.PI - 3 * Math.PI / 9;
                        max = 2 * Math.PI + 3 * Math.PI / 9;
                    }
                    else //Derecha
                    {
                        min = Math.PI - 3 * Math.PI / 9;
                        max = Math.PI + 3 * Math.PI / 9;
                    }
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
            ctx.fillStyle = '#ff4dc4';
            for (let barrier of this.barriers) {
                // ctx.fillRect(barrier.x - barrier.w/2, barrier.y - barrier.h/2, barrier.w, barrier.h);
                drawRectRounded(ctx, barrier.x, barrier.y, barrier.w, barrier.h, 3)
            }
        }

		// Draw the 2x bonus
        if (this.settings.bonus && this.bonus.active) {
            ctx.fillStyle = '#f7d811';
            ctx.beginPath();
            ctx.arc(this.bonus.x, this.bonus.y, 0.6 * this.bonus.s, 0, 2 * Math.PI);
            ctx.fill();
            // ctx.fillRect(this.bonus.x - this.bonus.s/2, this.bonus.y - this.bonus.s/2, this.bonus.s, this.bonus.s);

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
export class Board {
    // Constructor method
    constructor(w, h) {
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
    }
    
    //TODO: Draw and update can be changed in order to create new boards with new obstacles 
    update(p1, p2, ball) {
        //Vertical Walls
        if (ball.y - ball.h/2 <= this.y - this.h/2 || ball.y + ball.h/2 >= this.y + this.h/2)
            ball.dir.y *= -1;
        //Goal Walls
        if (ball.x - ball.w/2 <= p1.x + p1.w/2 && !(ball.y > p1.y - p1.h/2 && ball.y < p1.y + p1.h/2))
        {
            ball.x = this.x;
            ball.y = this.y;
            ball.generateRandomInitAngle();
            p2.score++;
        }
        if (ball.x + ball.w/2 >= p2.x - p2.w/2 && !(ball.y > p2.y - p2.h/2 && ball.y < p2.y + p2.h/2))
        {
            ball.x = this.x;
            ball.y = this.y;
            ball.generateRandomInitAngle();
            p1.score++;
        }

        // Ball collision with Player1 | LEFT
        if (ball.nextStep().x - ball.w/2 <= p1.x + p1.w/2 && (ball.nextStep().y > p1.y - p1.h/2 && ball.nextStep().y < p1.y + p1.h/2))
        {
            ball.angle = 0;
            let min = 2*Math.PI - 3*Math.PI/9
            let max = 2*Math.PI + 3*Math.PI/9
            ball.randomDeviation(min, max);
            // ball.rotateBall(Math.PI);
            // ball.randomDeviation(0.9);
        }
        // Ball collision with Player2 | RIGHT
        if (ball.nextStep().x + ball.w/2 >= p2.x - p2.w/2 && (ball.nextStep().y > p2.y - p2.h/2 && ball.nextStep().y < p2.y + p2.h/2))
        {
            ball.angle = 0;
            let min = Math.PI - 3*Math.PI/9
            let max = Math.PI + 3*Math.PI/9
            ball.randomDeviation(min, max);
            // ball.rotateBall(Math.PI);
            // ball.randomDeviation(0.9);
        }
        // -------------------------------------------------------------------------------------
    }
    
    draw(ctx) {
        ctx.lineWidth = 8;
        ctx.strokeStyle = "white";
        //Border
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.fillStyle = 'white';
        //Midline
        ctx.fillRect(this.w/2 - 2, 0, 4, this.h);
        ctx.lineWidth = 4;
        //MidSquare
        ctx.strokeRect(this.w/2 - 46, this.h/2 - 46, 92, 92);

        ctx.fillStyle = this.goal_color;
        ctx.fillRect(0 + 4, 0 + 4, this.goal.p1 - 4, this.h - 8);
        ctx.fillRect(this.goal.p2, 0 + 4, this.goal_size - 4, this.h - 8);
    }

    onResize(w, h) {
        this.x = w/2
        this.y = h/2;
        this.w = w;
        this.h = h;
        this.goal =
        {
            p1: this.goal_size,
            p2: this.w - this.goal_size
        }; 
    }
}
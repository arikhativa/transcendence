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
            p2.score++;
        }
        if (ball.x + ball.w/2 >= p2.x - p2.w/2 && !(ball.y > p2.y - p2.h/2 && ball.y < p2.y + p2.h/2))
        {
            ball.x = this.x;
            ball.y = this.y;
            p1.score++;
        }

        // Ball collision with Player1
        if (ball.x - ball.w/2 <= p1.x + p1.w/2 && (ball.y > p1.y - p1.h/2 && ball.y < p1.y + p1.h/2))
        {
            ball.dir.x *= -1;
            if (p1.dir)
                ball.dir.y = p1.dir;
        }
        // Ball collision with Player2
        if (ball.x + ball.w/2 >= p2.x - p2.w/2 && (ball.y > p2.y - p2.h/2 && ball.y < p2.y + p2.h/2))
        {
            ball.dir.x *= -1;
            if (p2.dir)
                ball.dir.y = p2.dir;
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
  }
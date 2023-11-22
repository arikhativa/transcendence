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
    
    update() {
    }
    
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.fillStyle = 'black';
        ctx.fillRect(4, 4, this.w-8, this.h-8);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.w/2 - 2, 0, 4, this.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.w/2 - 50, this.h/2 - 50, 100, 100);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.w/2 - 46, this.h/2 - 46, 92, 92);

        ctx.fillStyle = this.goal_color;
        ctx.fillRect(0 + 4, 0 + 4, this.goal.p1 - 4, this.h - 8);
        ctx.fillStyle = this.goal_color;
        ctx.fillRect(this.goal.p2, 0 + 4, this.goal_size - 4, this.h - 8);
    }
  }
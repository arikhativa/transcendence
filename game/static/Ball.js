export class Ball {
    // Constructor method
    constructor(x, y, ballSpeed, ballColor) {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 30;

        this.speed = ballSpeed;
        this.color = ballColor;
        this.dir = {
            x: 2/Math.sqrt(3),
            y: 1/Math.sqrt(3)
        };
        
        this.hitBy = null;
    }
  
    update() {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    }
  }
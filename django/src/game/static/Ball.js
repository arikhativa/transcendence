export class Ball {
    // Constructor method
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 40;

        this.speed = 16;
        this.color = 'red';
        this.angle = 0;
        this.generateRandomInitAngle();
    }
  
    update() {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    }

    generateRandomInitAngle() {
        let min, max;
        if (Math.cos(this.angle) < 0) {
            min = 2*Math.PI - 3*Math.PI/9
            max = 2*Math.PI + 3*Math.PI/9
        } else {
            min = Math.PI - 3*Math.PI/9
            max = Math.PI + 3*Math.PI/9
        }
        this.angle = 0;
        this.randomDeviation(min, max);
        if (this.angle >= 2 * Math.PI) this.angle -= (2 * Math.PI);
        if (this.angle < 0) this.angle += (2 * Math.PI);
        this.dir = {
            x: Math.cos(this.angle),
            y: -Math.sin(this.angle),
        };
    }
    rotateBall(angle) {
        this.angle += angle;
        if (this.angle >= 2 * Math.PI) this.angle -= (2 * Math.PI);
        if (this.angle < 0) this.angle += (2 * Math.PI);
        this.dir = {
            x: Math.cos(this.angle),
            y: -Math.sin(this.angle),
        };
    }
    randomDeviation(min, max) {
        let randomOffset = Math.random() * (max - min) + min;
        this.rotateBall(randomOffset);
        console.log(randomOffset);
    }
    nextStep() {
        return {
            x: this.x + this.dir.x * this.speed,
            y: this.y + this.dir.y * this.speed
        };
    }
    onResize(x, y) {
        this.x = x;
        this.y = y;
    }
}
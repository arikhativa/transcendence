import { drawRectRounded } from './draw_helpers.js';

export class Ball {
    // Constructor method
    constructor(x, y, ballSpeed, ballColor) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 40;

        this.speed = ballSpeed;
        this.setColor(ballColor);
        this.angle = 0;
        this.generateRandomInitAngle();
        this.hitBy = null;
    }
  
    update() {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        drawRectRounded(ctx, this.x, this.y, this.w, this.h, 5);
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

    setColor(color) {
        switch (color) {
            case "green":
                this.color = '#a8ff66';
                console.log("asd" + this.color);
                break;
            case "red":
                this.color = '#ff6666';
                break;
            case "blue":
                this.color = '#66baff';
                break;
            default:
                this.color = 'white';
                break;
        }
    }
}
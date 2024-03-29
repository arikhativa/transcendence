import { drawRectRounded, drawBorderRounded } from './draw_helpers.js';

export class Player {
    // Constructor method
    constructor(name) {
        this.name = name
        this.w = 30;
        this.h = 300;
        this.h_visual = this.h - this.h * 0.2;

        this.speed = 10;
        this.color = 'white'
        //Control state
        this.controls = {
            up: { state: false, keys: "" },
            down: { state: false, keys: "" }
        };
        this.dir = 0;
        this.score = 0;
        this.bonus = false;
    }

    update(board) {
        if (this.controls.up.state)
            if ((this.y - this.h_visual / 2 - this.speed > board.y - board.h / 2))
                this.y -= this.speed;
        if (this.controls.down.state)
            if ((this.y + this.h_visual / 2 + this.speed < board.y + board.h / 2))
                this.y += this.speed;
    }

    draw(ctx, board) {
        ctx.fillStyle = 'white';
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        if (this.isLeftPlayer) {
            ctx.fillText(this.name, board.w / 4, 50);
            ctx.fillText(this.score, board.w / 4, 50 + 50);
        }
        else {
            ctx.fillText(this.name, 3 * (board.w / 4), 50);
            ctx.fillText(this.score, 3 * (board.w / 4), 50 + 50);
        }

        ctx.fillStyle = this.color;
        drawRectRounded(ctx, this.x, this.y, this.w, this.h_visual, 10);
        if (this.bonus)
            drawBorderRounded(ctx, this.x, this.y, this.w, this.h_visual, 10);
    }

    move_listener(e, isKeyDown) {
        this.dir = 0;
        if (this.controls.up.keys.indexOf(e.key) !== -1) {
            this.controls.up.state = isKeyDown;
            this.dir = -1;
        }
        else if (this.controls.down.keys.indexOf(e.key) !== -1) {
            this.controls.down.state = isKeyDown;
            this.dir = 1;
        }
        if (!isKeyDown)
            this.dir = 0;
    }

    setLeftPlayer() {
        if (!canvas)
			return ;

        this.controls = {
            up: { state: false, keys: "wW" },
            down: { state: false, keys: "sS" }
        };
        this.x = 30;
        this.y = canvas.height / 2
        this.isLeftPlayer = true;
        this.score = 0;
    }

    setRightPlayer() {
        if (!canvas)
			return ;
        
        this.controls = {
            up: {state: false, keys: ["i", "I", "ArrowUp"]},
            down: {state: false, keys: ["k", "K", "ArrowDown"]}};
        this.x = canvas.width - 30;
        this.y = canvas.height / 2;
        this.isLeftPlayer = false;
        this.score = 0;
    }
    onResize(canvas) {
        if (!canvas)
            return;
        if (this.isLeftPlayer) {
            this.x = 30;
            this.y = canvas.height / 2;
        } else {
            this.x = canvas.width - 30;
            this.y = canvas.height / 2
        }
    }
    setColor(color) {
        switch (color) {
            case "green":
                this.color = '#a7f711';
                break;
            case "red":
                this.color = '#f71135';
                break;
            case "blue":
                this.color = '#1193f7';
                break;
            default:
                this.color = 'white';
                break;
        }
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    drawPowered(ctx) {
        drawBorderRounded(ctx, this.x, this.y, this.w, this.h_visual, 20);
    }
}
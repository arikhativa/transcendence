export class Player {
    // Constructor method
    constructor(name) {
        this.name = name
        this.w = 30;
        this.h = 200;

        this.speed = 5;
        this.color = 'white'
        //Control state
        this.controls = {
            up: {state: false, keys: ""},
            down: {state: false, keys: ""}
        };
        this.dir = 0;
        this.score = 0;
    }
  
    update(board) {
        if (this.controls.up.state)
            if ((this.y - this.h/2 - this.speed > board.y - board.h/2))
                this.y -= this.speed;    
        if (this.controls.down.state)
            if ((this.y + this.h/2 + this.speed < board.y + board.h/2))
                this.y += this.speed;
    }
    
    draw(ctx, board) {
		ctx.fillStyle = 'white';
		ctx.font = "50px Arial";
        if (this.isLeftPlayer)
		    ctx.fillText(this.name, board.w / 4, 50);
        else
		    ctx.fillText(this.name, 3 * (board.w / 4), 50);

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
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
        this.controls = {
            up: {state: false, keys: "wW"},
            down: {state: false, keys: "sS"}};
        this.x = 30;
        this.y = canvas.height/2
        this.isLeftPlayer = true;
        this.score = 0;
    }
    
    setRightPlayer() {
        this.controls = {
            up: {state: false, keys: ["i", "I", "ArrowUp"]},
            down: {state: false, keys: ["k", "K", "ArrowDown"]}};
        this.x = canvas.width - 30;
        this.y = canvas.height/2;
        this.isLeftPlayer = false;
        this.score = 0;
    } 
}
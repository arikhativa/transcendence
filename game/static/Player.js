export class Player {
    // Constructor method
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
    }
  
    update(board) {
        if (this.controls.up.state)
            if ((this.y - this.h/2 - this.speed > board.y - board.h/2))
                this.y -= this.speed;    
        if (this.controls.down.state)
            if ((this.y + this.h/2 + this.speed < board.y + board.h/2))
                this.y += this.speed;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    }

    on_collision(other) {
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

    setControls(controls) {
        this.controls = controls;
    } 
  }
export class Button {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.color = color;
        this.border = true;
        this.fill = false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 7;
        ctx.lineJoin = 'round';
        if (this.fill)
            ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    isClicked(mouseX, mouseY) {
        console.log({x:mouseX, y:mouseY});
        console.log({x:this.x, y:this.y});

        if ((mouseX >= this.x && mouseX <= this.x+this.w)
            && mouseY >= this.y && mouseY <= this.y+this.h) {
            return true;
        }
        return false;
    }
}

export class Customization {
    // Constructor method
    constructor(game, canvas) {
        this.canvas = canvas;
        this.game = game;

        //P1 Color Buttons
        this.P1_w = new Button((canvas.width/4 - 30), canvas.height/2 + 260, 30, 30, 'white');
        this.P1_r = new Button((canvas.width/4 - 30), canvas.height/2 + 200, 30, 30, 'red');
        this.P1_g = new Button((canvas.width/4 - 30) - 60, canvas.height/2 + 200, 30, 30, 'green');
        this.P1_b = new Button((canvas.width/4 - 30) + 60, canvas.height/2 + 200, 30, 30, 'blue');
        this.test = 0;

        //P2 Color Buttons
        this.P2_w = new Button((3*(canvas.width/4) - 30), canvas.height/2 + 260, 30, 30, 'white');
        this.P2_r = new Button((3*(canvas.width/4) - 30), canvas.height/2 + 200, 30, 30, 'red');
        this.P2_g = new Button((3*(canvas.width/4) - 30) - 60, canvas.height/2 + 200, 30, 30, 'green');
        this.P2_b = new Button((3*(canvas.width/4) - 30) + 60, canvas.height/2 + 200, 30, 30, 'blue');

        //Bonus Button
        this.bonus = new Button(2*this.canvas.width/5 - 30/2, this.canvas.height/2 + 60 - 30/2, 30, 30, 'white');

        //Walls Button
        this.walls = new Button(3*this.canvas.width/5 - 30/2, this.canvas.height/2 + 60 - 30/2, 30, 30, 'white');
    }
  
    listener(event, self) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;
        
        //Change P1 colors
        if (self.P1_w.isClicked(mouseX, mouseY))
            self.game.p1.color = self.P1_w.color;
        if (self.P1_r.isClicked(mouseX, mouseY))
            self.game.p1.color = self.P1_r.color;
        if (self.P1_g.isClicked(mouseX, mouseY))
            self.game.p1.color = self.P1_g.color;
        if (self.P1_b.isClicked(mouseX, mouseY))
            self.game.p1.color = self.P1_b.color;

        //Change P2 colors
        if (self.P2_w.isClicked(mouseX, mouseY))
            self.game.p2.color = self.P2_w.color;
        if (self.P2_r.isClicked(mouseX, mouseY))
            self.game.p2.color = self.P2_r.color;
        if (self.P2_g.isClicked(mouseX, mouseY))
            self.game.p2.color = self.P2_g.color;
        if (self.P2_b.isClicked(mouseX, mouseY))
            self.game.p2.color = self.P2_b.color;

        //Change 2X Bonus
        if (self.bonus.isClicked(mouseX, mouseY))
            if (self.game.board.settings.bonus)
                self.game.board.bonus.active = !(self.game.board.bonus.active);

        //Change 2X Bonus
        if (self.walls.isClicked(mouseX, mouseY))
            self.game.board.settings.barriers = !(self.game.board.settings.barriers);
    }

    draw(ctx, canvas, game, custom) {
        let img = new Image();
        img.src = "https://cdn-icons-png.flaticon.com/512/8694/8694747.png";
        ctx.drawImage(img, canvas.width/2 - img.width/6, 50, img.width/3, img.height/3);

        //Draw P1
		ctx.fillStyle = game.p1.color;
        ctx.fillRect(canvas.width/4 - 30, canvas.height/2 - 200/2, 30, 200);
        switch (game.p1.color) {
            case this.P1_w.color:
                this.P1_w.fill = true;
                this.P1_r.fill = false;
                this.P1_g.fill = false;
                this.P1_b.fill = false;
                break;
            case this.P1_r.color:
                this.P1_w.fill = false;
                this.P1_r.fill = true;
                this.P1_g.fill = false;
                this.P1_b.fill = false;
                break;
            case this.P1_g.color:
                this.P1_w.fill = false;
                this.P1_r.fill = false;
                this.P1_g.fill = true;
                this.P1_b.fill = false;
                break;
            case this.P1_b.color:
                this.P1_w.fill = false;
                this.P1_r.fill = false;
                this.P1_g.fill = false;
                this.P1_b.fill = true;
                break;
        }
        this.P1_w.draw(ctx);
        this.P1_r.draw(ctx);
        this.P1_g.draw(ctx);
        this.P1_b.draw(ctx);
        
        //Draw P2
		ctx.fillStyle = game.p2.color;
        ctx.fillRect(3*(canvas.width/4) - 30, canvas.height/2 - 200/2, 30, 200);
        switch (game.p2.color) {
            case this.P2_w.color:
                this.P2_w.fill = true;
                this.P2_r.fill = false;
                this.P2_g.fill = false;
                this.P2_b.fill = false;
                break;
            case this.P2_r.color:
                this.P2_w.fill = false;
                this.P2_r.fill = true;
                this.P2_g.fill = false;
                this.P2_b.fill = false;
                break;
            case this.P2_g.color:
                this.P2_w.fill = false;
                this.P2_r.fill = false;
                this.P2_g.fill = true;
                this.P2_b.fill = false;
                break;
            case this.P2_b.color:
                this.P2_w.fill = false;
                this.P2_r.fill = false;
                this.P2_g.fill = false;
                this.P2_b.fill = true;
                break;
        }
        this.P2_w.draw(ctx);
        this.P2_r.draw(ctx);
        this.P2_g.draw(ctx);
        this.P2_b.draw(ctx);

        //Draw Bonus
        ctx.fillStyle = 'yellow';
        // ctx.fillRect(this.canvas.width/2 - 50/2, this.canvas.height/2 - 50/2, 50, 50);
        ctx.fillRect(2*this.canvas.width/5 - 50/2, this.canvas.height/2 - 50/2, 50, 50);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText('2x', 2*this.canvas.width/5, this.canvas.height/2);
        this.bonus.fill = this.game.board.bonus.active;
        this.bonus.draw(ctx);

        //Draw Walls
        ctx.fillStyle = 'orange';
        // ctx.fillRect(this.canvas.width/2 - 50/2, this.canvas.height/2 - 50/2, 50, 50);
        ctx.fillRect(3*this.canvas.width/5 - 50/2, this.canvas.height/2 - 50/2, 50, 50);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText('W', 3*this.canvas.width/5, this.canvas.height/2);
        this.walls.fill = this.game.board.settings.barriers;
        this.walls.draw(ctx);
    }
  }
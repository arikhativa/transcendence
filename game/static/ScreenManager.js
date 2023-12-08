export class ScreenManager {
    // Constructor method
	constructor() {
		this.screens = {
			INTRO: 0,
			GAME: 1,
			VSSCREEN: 2,
			ENDOFMATCH: 3,
			ENDOFTOURNAMENT: 4,
			TOURNAMENTTREE: 5
		};
		
        this.currentScreen = this.screens.INTRO;
        this.nextScreen = this.screens.GAME;
        this.transition = false;
        this.transitionSwitch = false;
        this.transitionPerc = 1;
	}
    
    loop(ctx, canvas, game, tournament) {
        ctx.globalAlpha = Math.min(Math.max(parseFloat(this.transitionPerc), 0), 1);
        //Draw game
        switch (this.currentScreen) {
            case this.screens.INTRO:
                this.introScreen(ctx, canvas);
                break;
            case this.screens.GAME:
                this.gameScreen(ctx, game);
                break;
            case this.screens.VSSCREEN:
                this.vsScreen(ctx, canvas, game);
                break;
            case this.screens.ENDOFTOURNAMENT:
                this.endOfTournamentScreen(ctx, canvas, game);
                break;
            case this.screens.TOURNAMENTTREE:
                this.tournamentTreeScreen(ctx, tournament);
                break;
            case this.screens.ENDOFMATCH:
                this.endOfMatchScreen(ctx, canvas, game);
                break;
        }
        this.transitionHandler();
	}

	draw(ctx) {
	}

    //Screen Handlers
    gameScreen(ctx, game) {
        if (!this.transition && !game.pause)
            game.update();
        game.draw(ctx);
    }
    
    introScreen(ctx, canvas) {
        // Clear the canvas to render new frame
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "100px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("PONG", canvas.width/2, canvas.height/2 - 70);
        ctx.fillText("Press space to start", canvas.width/2, canvas.height/2 + 100);
    }
    
    vsScreen(ctx, canvas, game) {
        // Clear the canvas to render new frame
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "100px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(game.p1.name + " VS " + game.p2.name, canvas.width/2, canvas.height/2 - 70);
    }
    
    endOfTournamentScreen(ctx, canvas, game) {
        // Clear the canvas to render new frame
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "100px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(game.winner_name + " won", canvas.width/2, canvas.height/2 - 70);
        ctx.fillText("the TOURNAMENT!", canvas.width/2, canvas.height/2 + 100);
    }
    
    endOfMatchScreen(ctx, canvas, game) {
        // Clear the canvas to render new frame
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "100px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(game.winner_name + " won", canvas.width/2, canvas.height/2 - 70);
        ctx.fillText("the match!", canvas.width/2, canvas.height/2 + 100);
    }
    
    tournamentTreeScreen(ctx, tournament) {
        tournament.phaseChange = false;
        let depth = tournament.maxDepth;
        let size = ((2**depth)/2 + 2);
        ctx.fillStyle = 'white';
    
        let tile_width = canvas.width / size;
        for (let i = 0; i < size/2; i++) {
            let ammount = 2**(depth - 1 - i);
            let tile_height = canvas.height / ammount;
            let h = tile_width * (9/18);
            for (let k = 0; k < ammount; k++) {
                let pos_left = [(i * tile_width) + tile_width/2, (k * tile_height) + tile_height/2];
                let pos_right = [((size - i - 1) * tile_width) + tile_width/2, (k * tile_height) + tile_height/2];
                //Player Boxes
                let h = tile_width / 2;
                ctx.lineWidth = 8;
                ctx.strokeStyle = "white";
                ctx.strokeRect(pos_left[0] - tile_width/2 + 10, pos_left[1] - h/2, tile_width - 20, h);
                ctx.strokeRect(pos_right[0] - tile_width/2 + 10, pos_right[1] - h/2, tile_width - 20, h);
    
                //Player Names
                ctx.fillStyle = 'white';
                ctx.font = "30px Arial";
                ctx.fillText("Player name", pos_right[0], pos_right[1] + 15);
    
                ctx.fillText("Player name", pos_left[0], pos_left[1] + 15);
                ctx.fillStyle = 'white';
            }
        }
    }

    //Transition Handler
    transitionHandler() {
        let fadeOutSpeed = 0.05;
        let fadeInSpeed = 0.05;
        // Handle transition
        if (this.transition) {
            if (!this.transitionSwitch)
                this.transitionPerc -= fadeOutSpeed;
            else {
                this.currentScreen = this.nextScreen;
                this.transitionPerc += fadeInSpeed;
            }
            if (this.transitionPerc <= -0.5) {
                this.transitionSwitch = !this.transitionSwitch;
            }
            if (this.transitionPerc >= 1) {
                this.transition = false;
                this.transitionPerc = 1;
                this.transitionSwitch = !this.transitionSwitch;
            }
        }
    }
}
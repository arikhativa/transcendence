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
    

	drawBoxes(ctx, ammount, tile_width, tile_height, size, i, tournament)
	{
		let left_index = 0;
		let right_index = tournament.auxTournament.length / 2;
		if (right_index * 2 < tournament.auxTournament.length)
			++right_index;

		for (let k = 0; k < ammount; k++) {

			let pos_left = [(i * tile_width) + tile_width/2, (k * tile_height) + tile_height/2];
			let pos_right = [((size - i - 1) * tile_width) + tile_width/2, (k * tile_height) + tile_height/2];
			//Player Boxes
			let h = tile_width / 4;
			ctx.lineWidth = 4;
			ctx.strokeStyle = "white";
			ctx.strokeRect(pos_left[0] - tile_width/2 + 10, pos_left[1] - h/2, tile_width - 20, h);
			ctx.strokeRect(pos_right[0] - tile_width/2 + 10, pos_right[1] - h/2, tile_width - 20, h);

			// round 4 is round of 16
			// round 3 is round of 8
			// round 2 is round of 4
			// round 1 is round of 2
			// i 1 is -> 16
			// i 2 is -> 8
			// i 3 is -> 4
			// i 4 is -> 2
			if (i == 4 - tournament.round)
			{
				let fontSize = (tile_width / 6);
				let offset = (h / 5);

				ctx.fillStyle = 'white';
				ctx.font = `${fontSize}px Arial`;
				ctx.textAlign = "center";

				ctx.fillText(tournament.auxTournament[left_index].obj.name, pos_right[0], pos_right[1] + offset);
	
				if (right_index < tournament.auxTournament.length)
					ctx.fillText(tournament.auxTournament[right_index].obj.name, pos_left[0], pos_left[1] + offset);

				ctx.fillStyle = 'white';
				++left_index;
				++right_index;
			}

		}
	}

    tournamentTreeScreen(ctx, tournament) {
		if (!canvas)
			return ;

        tournament.phaseChange = false;
		// we always print all 16 boxes
        let depth = 4;
        let size = 8;
        ctx.fillStyle = 'white';


        let tile_width = canvas.width / size;
        for (let i = 0; i < size/2; i++) {
            let ammount = 2**(depth - 1 - i);
            let tile_height = canvas.height / (ammount);
			this.drawBoxes(ctx, ammount, tile_width, tile_height, size, i, tournament);
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
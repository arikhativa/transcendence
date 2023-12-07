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
		
		this.screenHandler = Array(6).fill(null);
        this.currentScreen = this.screens.INTRO;
        this.transition = false;
	}
    
    update() {
        this.screenHandler[this.currentScreen];
	}

	draw(ctx) {
	}

	addScreenHandler(type, handler) {
		this.screenHandler[type] = handler;
	}
}
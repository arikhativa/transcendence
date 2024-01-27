export class GameSetting {
	constructor()
	{
		this.formButton = document.getElementById("game-settings-btn");
		if (this.formButton)
		{
			this.formButton.onclick = this.SubmitForm;
		}
	}

	SubmitForm()
	{
		let form = document.getElementById("game-settings-form");
		console.log("asd", form);
	}
}

const gameSettings = new GameSetting();

function submitForm(e) {
	e.preventDefault();
  
	var myform = document.getElementById("settings-form");
  
	var formData = new FormData(myform);
  
	fetch("/post_game_settings/", {
	  method: "POST",
	  body: formData,
	})
	  .then((response) => {
		console.log(response)
		if (!response.ok) {
		  throw new Error("network returns error");
		}
		return response.json();
	  })
	  .then((resp) => {
		console.log(resp);
		let successMsg = document.getElementById("success-message");

		if (resp.isValid)
		{
			successMsg.style.display = "block";
		}
		else 
		{
			successMsg.style.display = "None";
		}
	  })
	  .catch((error) => {
		// Handle error
		console.log("error ", error);
	  });
  }

var myform = document.getElementById("settings-form");

myform.addEventListener("submit", submitForm);
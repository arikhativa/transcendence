

function submitQRSetupForm(e) {
	e.preventDefault();
  
	var myform = document.getElementById("qr-setup-twofa-form");
  
	var formData = new FormData(myform);
  
	fetch("/post_twofa_code/", {
	  method: "POST",
	  body: formData,
	})
	  .then((response) => {
		if (!response.ok) {
		  throw new Error("network returns error");
		}
		return response.json();
	  })
	  .then((resp) => {
		let errElem = document.getElementById("qr-setup-error-msg");

		if (resp.isValid)
		{
			errElem.style.display = "None";

			return showSection("welcome_view", {}, true)
		}
		else 
		{
			errElem.style.display = "block";
		}
	  })
	  .catch((error) => {
		// Handle error
	  });
  }

var myform = document.getElementById("qr-setup-twofa-form");

myform.addEventListener("submit", submitQRSetupForm);



window.addEventListener('popstate', function(event) {
    if (event && event.state && event.state.path)
        showSection(event.state.path);
});

async function showSection(section, paramObject, shouldPushState) {
    if (section == undefined) {
        return Promise.resolve();
    }

    var url = new URL(window.location.href);
    url.search = "";
    url.pathname = section + "/";
    

    if (paramObject !== undefined)
    {
        const l = Object.entries(paramObject)
        const params = new URLSearchParams();
        for (const [key, value] of l) {
            params.set(key, value);
        }
        url.search = params.toString();
    }

    const historyURL = new URL(url);

    url.pathname = `section/${section}/`;

    return fetch(url.href)
        .then(response => {
            if (!response.ok || response.status != 200) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // Inject HTML content
            document.querySelector('#dynamic-content').innerHTML = html;

            // Inject scripts
            const scripts = document.querySelectorAll('#dynamic-content script');
            scripts.forEach((script) => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = 'module';
                // Adding timestamp to script to force reload of the js files
                newScript.src = script.src + '?v=' + new Date().getTime();
                script.parentNode.replaceChild(newScript, script);
            });
			if (shouldPushState)
            	history.pushState(null, null, historyURL.href);
        })
        .catch(error => console.debug('Error loading HTML:', error));
}

function setAllSPAButtons()
{
	document.querySelectorAll('.spa-btn').forEach(button => {
        if (button.value == undefined) {
            // console.error("Error: button.value is undefined");
            return;
        }
        button.onclick = async function() {
            return await showSection(this.value, undefined, true)
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    setAllSPAButtons()
});

const validSection = ["game", "tournament", "main", "game_settings", "email_setup", "qr_setup", "twofa"];

// This is for hisrtory back
window.addEventListener('popstate', async function(event) {
	let section = event.target.location.pathname;
	
	section = section.replace(/^\//, "");
	section = section.replace(/\/$/, "");

	if (!validSection.includes(section))
		section = "main";

	if (section == "twofa")
	{
		const code = new URLSearchParams(event.target.location.search).get('code');
		return await showSection(section, {"code": code}, false)
			.then(() => {
				setAllSPAButtons();
			});
	}

	const playersParam = new URLSearchParams(event.target.location.search).get('players');

	if (playersParam)
		return await showSection(section, {"players": playersParam}, false)
			.then(() => {
				setAllSPAButtons();
			});
	else
		return await showSection(section, undefined, false)
		.then(() => {
			setAllSPAButtons();
		});

   }, false);
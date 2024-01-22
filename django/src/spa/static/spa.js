
window.addEventListener('popstate', function(event) {
    if (event && event.state && event.state.path)
        showSection(event.state.path);
});

function showSection(section, paramObject) {
    if (section == undefined) {
        return;
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

    fetch(url.href)
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
            history.pushState(null, null, historyURL.href);
        })
        .catch(error => console.debug('Error loading HTML:', error));
    
}

document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll('.spa-btn').forEach(button => {
        if (button.value == undefined) {
            // console.error("Error: button.value is undefined");
            return;
        }
        button.onclick = function() {
            showSection(this.value)
        }
    })

});
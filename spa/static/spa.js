
window.addEventListener('popstate', function(event) {
    showSection(event.state.path);
});

function showSection(section, paramObject) {
    if (section == undefined) {
        return;
    }

    var url = new URL(window.location.href);
    url.pathname = section + "/";
    
    // TODO maybe add params to this
    history.pushState(null, null, url.href);

    url.pathname = `section/${section}/`;

    if (paramObject !== undefined)
    {
        const l = Object.entries(paramObject)
        const params = new URLSearchParams(url.search);
        for (const [key, value] of l) {
            params.set(key, value);
        }
        url.search = params.toString();
    }

    fetch(url.href)
        .then(response => response.text())
        .then(html => {
            // Inject HTML content
            document.querySelector('#dynamic-content').innerHTML = html;

            // Inject scripts
            const scripts = document.querySelectorAll('#dynamic-content script');
            scripts.forEach((script) => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = 'module';
                script.parentNode.replaceChild(newScript, script);
            });
        })
        .catch(error => console.error('Error loading HTML:', error));
}

document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll('.spa-btn').forEach(button => {
        if (button.value == undefined) {
            console.log("Error: button.value is undefined");
            return;
        }
        button.onclick = function() {
            showSection(this.value)
        }
    })

});
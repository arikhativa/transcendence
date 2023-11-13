
window.addEventListener('popstate', function(event) {
    showSection(event.state.path);
});

function showSection(section) {
    if (section == undefined) {
        return;
    }

    var url = new URL(window.location.href);
    url.pathname = section + "/";
    
    history.pushState(null, null, url.href);

    url.pathname = `section/${section}/`;

    // Fetch HTML content
    fetch(url.href)
        .then(response => response.text())
        .then(html => {
            // Inject HTML content
            
            document.querySelector('#dynamic-content').innerHTML = html;
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
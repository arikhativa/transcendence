
// function showSection(section) {   
//     fetch(`/${section}/`)
//     .then(response => response.text())
//     .then(text => {
//         document.querySelector('#dynamic-content').innerHTML = text;
//     });
// }

function showSection(section) {
    // Fetch HTML content
    fetch(`/${section}/`)
        .then(response => response.text())
        .then(html => {
            // Inject HTML content
            document.querySelector('#dynamic-content').innerHTML = html;

            // Fetch and inject CSS
            fetch(`/static/${section}.css`)
                .then(response => response.text())
                .then(css => {
                    const style = document.createElement('style');
                    style.innerHTML = css;
                    document.head.appendChild(style);
                })
                .catch(error => console.error('Error loading CSS:', error));

            // Fetch and inject JavaScript
            fetch(`/static/${section}.js`)
                .then(response => response.text())
                .then(js => {
                    const script = document.createElement('script');
                    script.innerHTML = js;
                    document.body.appendChild(script);
                })
                .catch(error => console.error('Error loading JavaScript:', error));
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
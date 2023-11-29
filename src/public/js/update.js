const URL_SERVER = 'https://node-sockets-app-0fe72adfe635.herokuapp.com/links';
// const URL_SERVER = 'http://localhost:3000/links';

const link = document.getElementById('link');
const valueLink = document.getElementById('valueLink');
const linksForm = document.getElementById('linksForm');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create new object for URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);

        // Get id parameter
        const idParam = urlParams.get('id');

        // Request
        const response = await fetch(`${URL_SERVER}/${idParam}`);
        const { data } = await response.json();

        // Autocomplete form
        link.value = data.link;
        valueLink.value = data.valueLink;
    } catch (error) {
        console.error(error);
    }
});

linksForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create new object for URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);

    // Get id parameter
    const idParam = urlParams.get('id');

    fetch(`${URL_SERVER}/${idParam}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valueLink: valueLink.value, link: link.value })
    })

    window.location.href = 'dashboard.html';
})
//const socket = new WebSocket('wss://node-sockets-app-0fe72adfe635.herokuapp.com');
 const socket = new WebSocket('ws://localhost:3000');

const buttonSubmit = document.getElementById('placaButton');
const spinnerContainer = document.getElementById('container-spinner');
const spinner = document.getElementById('spinner');

buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const placa = document.getElementById('placaInput').value;
    document.getElementById('placaInput').value = '';
    socket.send(JSON.stringify({ placa, state: true }));

    // Disabled input and button of the form
    document.getElementById('placaInput').disabled = true;
    document.getElementById('placaButton').disabled = true;

    spinnerContainer.classList.remove('disabled');
    spinner.classList.remove('disabled');
    spinnerContainer.classList.add('show');
    spinner.classList.add('show');
});

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.heartbeat) {
        // Ignore "heartbeats"
        return;
    }

    if (data.redirectUserId && data.message) {
        // Redirect user to pay.html and show alert with message received
        localStorage.setItem('message', data.message);
        window.location.href = `pay.html`;
    }
};
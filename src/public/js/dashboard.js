const socket = new WebSocket('wss://node-sockets-app-0fe72adfe635.herokuapp.com');
// const socket = new WebSocket('ws://localhost:3000');
const URL_SERVER = 'https://node-sockets-app-0fe72adfe635.herokuapp.com';
// const URL_SERVER = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    await loadTable();

    document.getElementById('linksForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await createLink();
        await loadTable();
    });
});

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.heartbeat) {
        // Ignore "heartbeats"
        return;
    }

    addNewPlate(data);
};

const addNewPlate = (placa) => {
    const tbody = document.querySelector('#platesTable tbody');
    const row = document.createElement('tr');

    row.setAttribute('data-state', placa.userId);

    row.innerHTML = `
        <td>${placa.userId}</td>
        <td>${placa.placa}</td>
        <td><button class="btn btn-success" onclick="sendMessage('${placa.userId}')">Enviar Mensaje</button></td>
    `;

    if (placa.state) {
        row.style.backgroundColor = '#dbeddc';
    } else {
        row.style.backgroundColor = '#ffbfaa';
    }

    tbody.appendChild(row);
}

const sendMessage = (userId) => {
    const message = prompt('Ingrese su mensaje:');

    if (message) {
        // Send message to server with userId
        socket.send(JSON.stringify({ userId, message }));

        // Update state by request user
        updatePlateState(userId, false);
    }
}

const updatePlateState = (userId, newState) => {
    const plateRow = document.querySelector(`#platesTable tbody tr[data-state="${userId}"]`);

    // Cambia el color de fondo y deshabilita el botón si el estado es false
    if (!newState) {
        plateRow.style.backgroundColor = '#ffbfaa';
        plateRow.querySelector('button').disabled = true;
    }

    // Actualiza el atributo data-state
    plateRow.setAttribute('data-state', userId);
}

// Links methods

const loadTable = async () => {
    try {
        const response = await fetch(`${URL_SERVER}/links`);
        const { data } = await response.json();

        const table = document.getElementById('linksTable').getElementsByTagName('tbody')[0];

        table.innerHTML = '';

        data.forEach(link => {
            const row = table.insertRow();
            const cellId = row.insertCell(0);
            const cellValueLink = row.insertCell(1);
            const cellLink = row.insertCell(2);
            const cellOptions = row.insertCell(3);

            cellId.innerHTML = link.id;
            cellValueLink.innerHTML = `$ ${link.valueLink}`;
            cellLink.innerHTML = link.link;

            // Created buttons for actions
            const buttonUpdate = document.createElement('button');
            buttonUpdate.classList.add('btn');
            buttonUpdate.classList.add('btn-warning');
            buttonUpdate.classList.add('me-2');
            buttonUpdate.textContent = 'Editar';
            buttonUpdate.addEventListener('click', () => {
                window.location.href = `update.html?id=${encodeURIComponent(link.id)}`
            });

            const buttonDelete = document.createElement('button');
            buttonDelete.classList.add('btn');
            buttonDelete.classList.add('btn-danger');
            buttonDelete.textContent = 'Eliminar';
            buttonDelete.addEventListener('click', async () => {
                await deleteLink(link.id);
            });

            cellOptions.appendChild(buttonUpdate);
            cellOptions.appendChild(buttonDelete);
        });
    } catch (error) {
        console.error('Error get links ', error);
    }
}

const deleteLink = async (id) => {
    try {
        await fetch(`${URL_SERVER}/links/${id}`, { method: 'DELETE' });
        await loadTable();
    } catch (error) {
        console.error('Error delete link ', error);
    }
}

const createLink = async () => {
    try {
        const valueLink = document.getElementById('valueLink').value;
        const link = document.getElementById('link').value;

        fetch(`${URL_SERVER}/links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valueLink, link })
        })

        document.getElementById('valueLink').value = '';
        document.getElementById('link').value = '';
    } catch (error) {
        console.error('Error created link ', error);
    }
}

document.querySelector('#btnLogout').addEventListener('click', async () => {
    try {
        const response = await fetch(`${URL_SERVER}/logout`);

        console.log("🚀 ~ file: dashboard.js:154 ~ document.querySelector ~ response:", response)
        if (response.status === 201) {
            window.location.href = `login.html`;
        }
    } catch (error) {
        console.error('Error logout dashboard ', error);
    }
})
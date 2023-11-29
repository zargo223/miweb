const URL_SERVER = 'https://node-sockets-app-0fe72adfe635.herokuapp.com/links';
// const URL_SERVER = 'http://localhost:3000/links';

let linkToButton = '';

document.addEventListener('DOMContentLoaded', async function () {
    // Get data of the localStorage
    const message = localStorage.getItem('message');

    if (message) {
        await dividerData(message);
    }
});

const dividerData = async (message) => {
    fetch(URL_SERVER)
        .then(response => response.json())
        .then(data => {
            alert('Data: ', data);
            // Divider message to localStorage  
            const lines = message?.split('\n');

            const ul = document.getElementById('ul');

            for (var i = 0; i < lines.length; i++) {
                // Crea un elemento li
                var li = document.createElement("li");

                // Agrega el texto al li con el índice y el elemento del array
                li.appendChild(document.createTextNode("Índice " + i + ": " + lines[i]));

                // Agrega el li a la lista ul
                ul.appendChild(li);
            }

            // Get VIN HTML
            const VIN = document.getElementsByClassName('plus-vin-detail')[0];

            // Set data in HTML
            document.getElementsByClassName('vehiculo-summary__value__placa')[0].innerHTML = lines[1].trim();
            document.getElementsByClassName('vehiculo-summary__value__marca')[0].innerHTML = lines[3].trim();
            document.getElementsByClassName('vehiculo-summary__value__linea')[0].innerHTML = lines[5].trim();
            document.getElementsByClassName('vehiculo-summary__value__modelo')[0].innerHTML = lines[7].trim();
            document.getElementById('vehiculo-detail-servicio').innerHTML = lines[10].split(':')[1].trim();
            document.getElementById('vehiculo-detail-clase').innerHTML = lines[11].split(':')[1].trim();
            document.getElementById('vehiculo-detail-cilindraje').innerHTML = lines[12].split(':')[1].trim();
            document.getElementById('vehiculo-detail-motor').innerHTML = lines[13].split(':')[1].trim();
            document.getElementById('vehiculo-detail-pasajeros').innerHTML = lines[14].split(':')[1].trim();
            document.getElementById('vehiculo-detail-combustible').innerHTML = lines[15].split(':')[1].trim();

            if (!lines[16].includes("Datos del tomador")) {
                VIN.classList.remove('disabled');
                document.getElementById('vehiculo-detail-vin').innerHTML = lines[16].split(':')[1].trim();
            }

            let linkToBuy;

            if (lines[34]) {
                document.getElementById('valuePay').innerHTML = lines[34].trim();
                document.getElementById('valuePayHidden').innerHTML = lines[34].trim();

                // Get data for value to pay
                const valueBuy = lines[34].split('$')[1].trim();

                // Convert to number value to pay
                linkToBuy = data.filter((link) => Number(link.valueLink) === parseInt(valueBuy.replace(/,/g, ''), 10));
            } else {
                document.getElementById('valuePay').innerHTML = lines[33].trim();
                document.getElementById('valuePayHidden').innerHTML = lines[33].trim();

                // Get data for value to pay
                const valueBuy = lines[33].split('$')[1].trim();

                // Convert to number value to pay
                linkToBuy = data.filter((link) => Number(link.valueLink) === parseInt(valueBuy.replace(/,/g, ''), 10));
            }

            // Assign link to button
            if (linkToBuy.length > 0) {
                linkToButton = linkToBuy[0].link;
            } else {
                linkToButton = 'https://www.google.com';
            }
        })
        .catch(error => {
            console.error(error);
        });
}

const formToBuy = document.getElementById('formPayToBuy');

formToBuy.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = linkToButton;
});
// Evento de login com validação
document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Verifica se os valores do login correspondem
    if (username === 'Pinheiro.iec' && password === '506505170') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
        showMessage("Login realizado com sucesso!", "success");
    } else {
        showMessage("Nome de usuário ou senha incorretos!", "error");
    }
});

// Função para exibir mensagens de feedback para o usuário
function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = message;

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

// Função para salvar ordens no Local Storage
function saveOrders() {
    const orders = [];
    document.querySelectorAll('#orderTable tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        orders.push({
            clientName: cells[0].textContent,
            address: cells[1].textContent,
            responsible: cells[2].textContent,
            serviceType: Array.from(cells[3].querySelectorAll('div')).map(div => div.textContent),
            worker: Array.from(cells[4].querySelectorAll('div')).map(div => div.textContent),
            hours: cells[5].textContent,
            tasks: cells[6].textContent,
            materials: cells[7].textContent,
            date: cells[8].textContent
        });
    });
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Função para carregar ordens salvas do Local Storage
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderTableBody = document.querySelector('#orderTable tbody');
    orderTableBody.innerHTML = ''; // Limpa a tabela antes de carregar os dados
    orders.forEach(order => {
        addOrderRow(orderTableBody, order);
    });
}

// Adicionar uma nova linha na tabela
function addOrderRow(orderTableBody, order) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${order.clientName}</td>
        <td>${order.address}</td>
        <td>${order.responsible}</td>
        <td>${order.serviceType.map(service => `<div>${service}</div>`).join('')}</td>
        <td>${order.worker.map(worker => `<div>${worker}</div>`).join('')}</td>
        <td>${order.hours}</td>
        <td>${order.tasks.split('\n').map(task => `<div>${task}</div>`).join('')}</td>
        <td>${order.materials.split('\n').map(material => `<div>${material}</div>`).join('')}</td>
        <td>${order.date}</td>
        <td>
            <button class="editOrder button-small">Editar</button>
            <button class="deleteOrder button-small">Apagar</button>
        </td>
    `;

    // Evento do botão "Editar"
    row.querySelector('.editOrder').addEventListener('click', () => {
        document.getElementById('clientName').value = order.clientName;
        document.getElementById('address').value = order.address;

        const responsibleField = document.getElementById('responsible');
        const serviceTypeField = document.getElementById('serviceType');
        const workerField = document.getElementById('worker');

        Array.from(responsibleField.options).forEach(option => {
            option.selected = option.value === order.responsible;
        });

        Array.from(serviceTypeField.options).forEach(option => {
            option.selected = order.serviceType.includes(option.textContent);
        });

        Array.from(workerField.options).forEach(option => {
            option.selected = order.worker.includes(option.textContent);
        });

        document.getElementById('hours').value = order.hours;
        document.getElementById('tasks').value = order.tasks;
        document.getElementById('materials').value = order.materials;
        document.getElementById('date').value = order.date;

        orderTableBody.removeChild(row);
        saveOrders();
        showMessage("Ordem carregada para edição.", "info");
    });

    // Evento do botão "Apagar"
    row.querySelector('.deleteOrder').addEventListener('click', () => {
        orderTableBody.removeChild(row);
        saveOrders();
        showMessage("Ordem apagada com sucesso!", "success");
    });

    orderTableBody.appendChild(row);
}

// Evento para adicionar uma nova ordem
document.getElementById('addOrder').addEventListener('click', () => {
    const clientName = document.getElementById('clientName').value;
    const address = document.getElementById('address').value;
    const responsible = document.getElementById('responsible').value;
    const serviceType = Array.from(document.getElementById('serviceType').selectedOptions).map(option => option.textContent);
    const worker = Array.from(document.getElementById('worker').selectedOptions).map(option => option.textContent);
    const hours = document.getElementById('hours').value;
    const tasks = document.getElementById('tasks').value;
    const materials = document.getElementById('materials').value;
    const date = document.getElementById('date').value;

    if (clientName && address && responsible && serviceType.length && worker.length && hours && tasks && materials && date) {
        const order = {
            clientName,
            address,
            responsible,
            serviceType,
            worker,
            hours,
            tasks,
            materials,
            date
        };

        addOrderRow(document.querySelector('#orderTable tbody'), order);
        saveOrders();
        document.getElementById('orderForm').reset();
        showMessage("Ordem adicionada com sucesso!", "success");
    } else {
        showMessage("Por favor, preencha todos os campos!", "error");
    }
});

// Carrega as ordens ao iniciar a página
window.onload = loadOrders;

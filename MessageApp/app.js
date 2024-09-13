const socket = new WebSocket('ws://localhost:3000');

// When the connection is open
socket.onopen = function () {
    console.log('WebSocket connection established');
};

// When a message is received from the server
socket.onmessage = function (event) {
    const statusElement = document.getElementById('status');
    const data = JSON.parse(event.data);
    if (data.success) {
        statusElement.textContent = 'Message sent successfully!';
        statusElement.classList.remove('text-red-500');
        statusElement.classList.add('text-green-500');
    } else {
        statusElement.textContent = `Error: ${data.error}`;
        statusElement.classList.remove('text-green-500');
        statusElement.classList.add('text-red-500');
    }
};

// Handle form submission
document.getElementById('messageForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const phoneNumber = document.getElementById('phoneNumber').value;
    const messageText = document.getElementById('messageText').value;

    // Send the data over WebSocket
    const data = {
        phoneNumber,
        messageText,
    };

    socket.send(JSON.stringify(data));
});

// Handle connection errors
socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'WebSocket connection error.';
    statusElement.classList.remove('text-green-500');
    statusElement.classList.add('text-red-500');
};

// When the WebSocket connection is closed
socket.onclose = function () {
    console.log('WebSocket connection closed');
};

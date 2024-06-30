const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');

do {
    name = prompt("Please Enter your Name");
} while (!name);

// Notify server that a new user has joined
socket.emit('user-joined', name);

let x = document.getElementById('send')
x.addEventListener('click', (e) => {
    sendMessage(textarea.value); // Fix: Use textarea value for sendMessage
});

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    };
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');
    let markup = `
        <h4 style="color:aliceblue">${msg.user}</h4>
        <p style="color:aliceblue">${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

socket.on('user-joined', (name) => {
    let joinMsg = {
        user: 'System',
        message: `${name} has joined the chat`
    };
    appendMessage(joinMsg, 'system');
    scrollToBottom();
});

socket.on('user-left', (name) => {
    let leftMsg = {
        user: 'System',
        message: `${name} has left the chat`
    };
    appendMessage(leftMsg, 'system');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

window.addEventListener('beforeunload', () => {
    socket.emit('user-left', name);
});




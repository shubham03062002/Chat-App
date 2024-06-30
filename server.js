const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000;
const io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('user-joined', (name) => {
        socket.broadcast.emit('user-joined', name);
        socket.username = name; // Save the username to the socket object
    });

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            socket.broadcast.emit('user-left', socket.username);
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`listening on port ${port}`);
});


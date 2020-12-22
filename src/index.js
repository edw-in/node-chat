const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io-client')(http);
const serverless = require("serverless-http");

const router = express.Router();

app.use(express.static('views'));

router.get('/', function(req, res) {
    res.render('index.ejs');
});

io.on('connection', function(socket) {
    socket.use('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.use('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.use('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

// const server = http.listen(8080, function() {
//     console.log('listening on *:8080');
// });

app.use('/.netlify/functions/index', router)

module.exports.handler = serverless(app);
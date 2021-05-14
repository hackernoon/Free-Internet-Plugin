var express = require('express')


var app = express()

var port = 8000 //any port u want 

var server = app.listen(port)

console.log('Running Server On Port: ' + port)

const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(socket) {
    console.log("Connection")

    socket.on('message', function recieved(data) {
        //flutter/dart socket has no header, 'message' recieves all incoming data 
        //the argument data is the string sent in flutter
        console.log('recieved: ' + data)
    })
})
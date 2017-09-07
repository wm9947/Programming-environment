#!/usr/bin/env node
 //UDP - Web Socket server js
//29-06-2017 check

var WebSocketServer = require('websocket').server;
var http = require('http');
var connection = null;

var PORT = 5000;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var count = 0;

var buffer = require('buffer');
var udp = require('dgram');
var client = udp.createSocket('udp4');

var data = Buffer.from('default');

var wserver = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
wserver.listen(8000, function() {
    console.log((new Date()) + ' Server is listening on port 8000');
});

wsServer = new WebSocketServer({
    httpServer: wserver,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);

            data = Buffer.from(message.utf8Data);
            sendUDP(data);
            
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        connection = null;
    });

});

function list(remote) {
    console.log(remote);
    var temp = {
        ip: remote.address,
        port: remote.port
    };

    if (count == 0) {
        clientList = {
            ip: temp.ip,
            port: temp.port
        };
        count++;
    }
    if (count >= 1) {
        clientList.push(temp);
    }
}

function sendbyWebsocket(message) {
    if (connection != null)
        connection.sendUTF(message);
}

server.on('listening', function() {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function(message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);

    sendbyWebsocket(message);
    server.send(message + 're', 0, message.length, remote.port, remote.address)

});

server.bind(PORT, HOST);

function sendUDP (msg) {
    client.send(msg, 7000, '127.0.0.1', function(error) {
                if (error) {
                    client.close();
                } else {
                    console.log('Data sent !!!');
                }
            });
}

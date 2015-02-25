var cv = require('opencv');
var fs = require('fs');
var util = require('util');
// var Buffer = require('buffer');

// var writeStream = fs.createWriteStream('');
var vid = new cv.VideoCapture(0);


var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

var clients = [];
// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
        }
    });

    setTimeout(sendImage, 10);

    function sendImage() {
      vid.read(function(err, mat){
        if (err) return self.emit('error', err);

        var img = mat.toBuffer()
        var data = img.toString('base64')

        var json = JSON.stringify({ type:'image', data: data });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      })
      setTimeout(sendImage, 30);
    }

    connection.on('close', function(connection) {
        // close user connection
        clients.splice(index, 1);
    });
});
console.log('Server running at http://127.0.0.1:1337/');




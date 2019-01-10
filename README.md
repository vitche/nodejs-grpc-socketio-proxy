# nodejs-grpc-socketio-proxy
A GRPC replacement for Socket.io which is compatible at the level of interfaces.

# The 'Ping' Web-socket server example
This example starts a server listening for a "ping" event.
And when the "ping" event is received, the "pong" event is sent to the client.
```javascript
let server = {
    address: function () {
        return {
            address: '0.0.0.0',
            port: 5001
        }
    }
};
let clientSocket = undefined;
let serverSocket = require('../main').ServerSocket(server);
serverSocket.on('connection', function (connection) {
    console.log('Accepted new connection');
    connection.on('ping', function (data) {
        connection.emit('pong', data);
    });
});
clientSocket = require('../main').ClientSocket.connect('0.0.0.0:5001', {});
clientSocket.on('pong', function (data) {
    console.log(data);
    clientSocket.disconnect();
});
clientSocket.emit('ping', {
    ':)': ':)'
});
```

# OnionRedis example of using Socket.io
This example is given to describe which Socket.io interfaces must be implemented to provide a working Socket.io replacement for the OnionRedis project.

![OnionRedis class diagram for Socket.io usage and replacement](https://raw.githubusercontent.com/vitche/nodejs-grpc-socketio-proxy/master/Documentation/OnionRedis%20Socket.io%20replacement.png)

The working GRPC replacement should implement:
- The client and server connection context;
- All proper events happening in the connection context.

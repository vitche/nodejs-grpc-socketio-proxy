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

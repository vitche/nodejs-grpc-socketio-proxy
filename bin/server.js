let server = {
    address: function () {
        return {
            address: '0.0.0.0',
            port: 5001
        }
    }
};
let serverSocket = require('../main').ServerSocket(server);
serverSocket.on('connection', function (connection) {
    console.log('Accepted new connection');
    connection.on('data', function (data) {
        console.log('Data:', data);
    });
    connection.on('get', function (data) {
        console.log('Data:', data);
    });
    connection.on('set', function (data) {
        console.log('Data:', data);
    });
    connection.on('subscribe', function (data) {
        console.log('Data:', data);
    });
    connection.on('publish', function (data) {
        console.log('Data:', data);
    });
    connection.on('message', function (data) {
        console.log('Data:', data);
    });
});

let clientSocket = require('../main').ClientSocket.connect('0.0.0.0:5001', {});
clientSocket.emit('get', {
    key: '))'
});
clientSocket.emit('set', {
    key: '))',
    value: ')))'
});
clientSocket.emit('subscribe', {
    channel: '))'
});
clientSocket.emit('publish', {
    channel: '))',
    message: ')))'
});
clientSocket.emit('message', {
    channel: '))',
    message: ')))'
});

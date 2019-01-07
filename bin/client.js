let clientSocket = require('../main').ClientSocket.connect('0.0.0.0:5001', {});
clientSocket.emit('get', JSON.stringify({
    key: '))'
}));
clientSocket.emit('set', JSON.stringify({
    key: '))',
    value: ')))'
}));
clientSocket.emit('subscribe', JSON.stringify({
    channel: '))'
}));
clientSocket.emit('publish', JSON.stringify({
    channel: '))',
    message: ')))'
}));
clientSocket.emit('message', JSON.stringify({
    channel: '))',
    message: ')))'
}));

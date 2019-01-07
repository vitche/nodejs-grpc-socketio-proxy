let clientSocket = require('../main').ClientSocket.connect('0.0.0.0:5001', {});
clientSocket.write({
    event: 'get',
    data: JSON.stringify({
        key: '))'
    })
});
clientSocket.write({
    event: 'set',
    data: JSON.stringify({
        key: '))',
        value: ')))'
    })
});
clientSocket.write({
    event: 'subscribe',
    data: JSON.stringify({
        channel: '))'
    })
});
clientSocket.write({
    event: 'publish',
    data: JSON.stringify({
        channel: '))',
        message: ')))'
    })
});
clientSocket.write({
    event: 'message',
    data: JSON.stringify({
        channel: '))',
        message: ')))'
    })
});

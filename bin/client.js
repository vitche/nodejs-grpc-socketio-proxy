let grpc = require("grpc");
let protocolLoader = require("@grpc/proto-loader");
let protocol = grpc.loadPackageDefinition(protocolLoader.loadSync('events.proto'), {});
let client = new protocol.events.Stream(
    "0.0.0.0:5001",
    grpc.credentials.createInsecure()
);
let channel = client.connect();
channel.on('data', function (data) {
    console.log(data);
});
channel.write({
    event: 'get',
    data: JSON.stringify({
        key: '))'
    })
});
channel.write({
    event: 'set',
    data: JSON.stringify({
        key: '))',
        value: ')))'
    })
});
channel.write({
    event: 'subscribe',
    data: JSON.stringify({
        channel: '))'
    })
});
channel.write({
    event: 'publish',
    data: JSON.stringify({
        channel: '))',
        message: ')))'
    })
});
channel.write({
    event: 'message',
    data: JSON.stringify({
        channel: '))',
        message: ')))'
    })
});
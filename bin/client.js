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
    event: '))',
    data: ')))'
});

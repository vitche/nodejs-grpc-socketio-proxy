var grpc = require('grpc');
var protocolLoader = require('@grpc/proto-loader');
const server = new grpc.Server();
var protocol = grpc.loadPackageDefinition(protocolLoader.loadSync('../events.proto'), {
});

function on(call, callback) {

}

function emit(call, callback) {

}

server.addService(protocol.events.Stream.service, { on: on, emit: emit});
server.bind("0.0.0.0:5001", grpc.ServerCredentials.createInsecure());
server.start();

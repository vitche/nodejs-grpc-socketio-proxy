let grpc = require('grpc');
let protocolLoader = require('@grpc/proto-loader');

const EventEmitter = require('events');

const grpcServer = new grpc.Server();
const protocol = grpc.loadPackageDefinition(protocolLoader.loadSync('events.proto'), {});

module.exports = {
    ClientSocket: {},
    ServerSocket: function (server) {
        let self = new EventEmitter();
        self.connections = [];
        grpcServer.addService(protocol.events.Stream.service, {
            connect: function (stream) {
                // TODO: Обернуть поток функциональностью, которая разворачивает приходящие данные в события
                // TODO: Поддержать события set / get / subscribe / publish
                self.connections.push(stream);
                self.emit('connection', stream);
            }
        });
        let address = server.address().address;
        let port = server.address().port;
        grpcServer.bind(address + ":" + port, grpc.ServerCredentials.createInsecure());
        grpcServer.start();
        return self;
    }
};

let grpc = require('grpc');
let protocolLoader = require('@grpc/proto-loader');

const EventEmitter = require('events');

const grpcServer = new grpc.Server();
const protocol = grpc.loadPackageDefinition(protocolLoader.loadSync('events.proto'), {});

module.exports = {
    ClientSocket: {
        connect: function (uri, configuration) {
            let client = new protocol.events.Stream(
                uri,
                grpc.credentials.createInsecure()
            );
            let stream = client.connect();
            stream._emit = stream.emit;
            stream.emit = function (event, data) {
                stream.write({
                    event: event,
                    data: JSON.stringify(data)
                });
            };
            // Разворачиваем приходящие данные в события
            stream.on('data', function (data) {
                let event = data.event;
                if (event) {
                    stream._emit(event, JSON.parse(data.data));
                }
            });
            return stream;
        }
    },
    ServerSocket: function (server) {
        let self = new EventEmitter();
        self.connections = [];
        grpcServer.addService(protocol.events.Stream.service, {
            connect: function (stream) {
                stream._emit = stream.emit;
                stream.emit = function (event, data) {
                    stream.write({
                        event: event,
                        data: JSON.stringify(data)
                    });
                };
                // Разворачиваем приходящие данные в события
                stream.on('data', function (data) {
                    let event = data.event;
                    if (event) {
                        stream._emit(event, JSON.parse(data.data));
                    }
                });
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

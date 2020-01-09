let grpc = require('grpc');
let protocolLoader = require('@grpc/proto-loader');

const EventEmitter = require('events');

const grpcServer = new grpc.Server();
const protocol = grpc.loadPackageDefinition(protocolLoader.loadSync(__dirname + '/events.proto'), {});

module.exports = {
    ExpressServerProxy: function (server) {
        let address = server.address().address;
        if ('::' === address) {
            address = '0.0.0.0';
        }
        let port = server.address().port;
        port++;
        this.address = function () {
            return {
                address: address,
                port: port
            }
        };
    },
    ClientSocket: {
        connect: function (uri, configuration) {
            let client = new protocol.events.Stream(
                uri,
                grpc.credentials.createInsecure()
            );
            let stream = client.connect();
            stream._emit = stream.emit;
            stream.emit = function (event, data) {
                if ('data' === event) {
                    // Событие "data" внутри библиотеки происходит крайне редко, при высокой нагрузке на сервер, и содержит
                    // какую-то информацию о сбросе буффера.
                    // При этом, часто мы сами можем хотеть создавать такое событие.
                    // Пробуем обработать это событие сразу двумя способами.
                    stream._emit(event, data);
                } else if ('resume' === event ||
                    'metadata' === event ||
                    'readable' === event ||
                    'end' === event ||
                    'cancelled' === event) {
                    // События "resume" и "metadata" происходят внутри библиотеки и мы их должны пропустить.
                    // Также мы не можем посылать собственные события с такими названиеми.
                    return stream._emit(event, data);
                }
                stream.write({
                    event: event,
                    data: JSON.stringify(data)
                });
            };
            // Разворачиваем приходящие данные в события
            stream.on('data', function (data) {
                let event = data.event;
                if (event) {
                    let payload = data.data;
                    if (payload) {
                        // TODO: This may crash in some cases
                        payload = JSON.parse(payload);
                    }
                    stream._emit(event, payload);
                }
            });
            stream.disconnect = function () {
                this.cancel();
            };
            // Сигнализировать о соединении на следующем шаге выполнения
            setTimeout(function () {
                stream._emit('connect', stream);
            }, 0);
            return stream;
        }
    },
    ServerSocket: function (server) {
        if ('Server' === server.constructor.name) {
            server = new this.ExpressServerProxy(server);
        }
        let self = new EventEmitter();
        self.connections = [];
        grpcServer.addService(protocol.events.Stream.service, {
            connect: function (stream) {
                stream._emit = stream.emit;
                stream.emit = function (event, data) {
                    if ('data' === event) {
                        // Событие "data" внутри библиотеки происходит крайне редко, при высокой нагрузке на сервер, и содержит
                        // какую-то информацию о сбросе буффера.
                        // При этом, часто мы сами можем хотеть создавать такое событие.
                        // Пробуем обработать это событие сразу двумя способами.
                        stream._emit(event, data);
                    } else if ('resume' === event ||
                        'metadata' === event ||
                        'readable' === event ||
                        'end' === event ||
                        'cancelled' === event) {
                        // События "resume" и "metadata" происходят внутри библиотеки и мы их должны пропустить.
                        // Также мы не можем посылать собственные события с такими названиеми.
                        return stream._emit(event, data);
                    }
                    if ('data' === event && data.event) {
                        // Запрещаем повторное оборачивание события
                        return;
                    } else {
                        stream.write({
                            event: event,
                            data: JSON.stringify(data)
                        });
                    }
                };
                // Разворачиваем приходящие данные в события
                stream.on('data', function (data) {
                    let event = data.event;
                    if (event) {
                        let eventArguments = undefined;
                        if (data.data) {
                            try {
                                eventArguments = JSON.parse(data.data);
                            } catch (error) {
                                eventArguments = data.data;
                            }
                        }
                        stream._emit(event, eventArguments);
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

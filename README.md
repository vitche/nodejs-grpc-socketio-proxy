# nodejs-grpc-socketio-proxy
A GRPC replacement for Socket.io which is compatible at the level of interfaces.

# OnionRedis example of using Socket.io
This example is given to describe which Socket.io interfaces must be implemented to provide a working Socket.io replacement for the OnionRedis project.

![OnionRedis class diagram for Socket.io usage and replacement](https://raw.githubusercontent.com/vitche/nodejs-grpc-socketio-proxy/master/Documentation/OnionRedis%20Socket.io%20replacement.png)

The working GRPC replacement should implement:
- The client and server connection context;
- All proper events happening in the connection context.

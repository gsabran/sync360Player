// import WS from 'ws';

// var WebSocket = require('ws'),
// 	WebSocketServer = WebSocket.Server,
// 	wss = new WebSocketServer({ port: 8080 });

// wss.on('connection', function connection(ws) {
//   	console.log("ws: " + getClientIPAddress(ws));
//   	ws.on('message', function incoming(message) {
//     	console.log('received: %s', message);

//     	var url = message.url;
//     	var userId = message.user.id;
//     	var userStaus = message.user.status;


//     	ws.send(message);
//   	});
// });

// console.log("websocket listening on port 8080");

// function getClientIPAddress(socket) {
// 	return socket.upgradeReq.headers['x-forwarded-for'] || socket.upgradeReq.connection.remoteAddress
// }

// var socket = new WebSocket('ws://localhost:8080');
// socket.send('{url: "123", user:"{id:"23",status:"45"}"}');

express = require('express');
app = require('express')();
router = express.Router();
http = require('http');
var server = http.Server(app);
io = require('socket.io')(server);

// some dictionaries to keep track of the sockets
var videoIdToSockets = [];
var socketToData = {};

// once a socket is over, remove its references
var removeSocket = function (socket) {
  var data = socketToData[socket.id];
  if (!data)
    return;

  delete socketToData[socket.id];
  var videoId = data.videoId;
  var idx = videoIdToSockets[videoId].indexOf(data);
  if (idx !== -1)
    videoIdToSockets[videoId].splice(idx, 1);
};

var broadcastRotation = function(data) {
  for (var k in videoIdToSockets[data.videoId]) {
    var socket = videoIdToSockets[data.videoId][k].socket;
    if (socket !== data.socket) {
      socket.emit('rotation', {
        userId: data.userId,
        rotation: data.rotation,
      });
    }
  }
};

var getAllRotations = function(data) {
  for (var k in videoIdToSockets[data.videoId]) {
    var previousData = videoIdToSockets[data.videoId][k];
    if (previousData.socket !== data.socket) {
      data.socket.emit('rotation', {
        userId: previousData.userId,
        rotation: previousData.rotation,
      });
    }
  }
};

io.on('connection', function(socket) {
  // keep track of the socket
  socket.on('auth', function(videoId, userId) {
    socket.id = videoId + '.' + userId;
    socketToData[socket.id] = {
      videoId: videoId,
      userId: userId,
      socket: socket,
    }
    videoIdToSockets[videoId] = videoIdToSockets[videoId] || [];
    videoIdToSockets[videoId].push(socketToData[socket.id]);
    getAllRotations(socketToData[socket.id]);
  });

  socket.on('setRotation', function(rotation) {
    var data = socketToData[socket.id];
    if (!data) {
      return;
    }
    data.rotation = rotation;
    broadcastRotation(data);
  });

  socket.on('terminateSession', function() {
    removeSocket(socket);
  });
  socket.on('disconnect', function() {
    removeSocket(socket);
  });
});

var port = 3002;
server.listen(port, function() {
});

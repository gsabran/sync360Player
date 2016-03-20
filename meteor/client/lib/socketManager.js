export const Socket = {
  // create a new channel and initiate the socket if necessary, and execute cb when possible
  create: function(rotationServerIPAddress, rotationServerPort, cb) {
    if (typeof io !== 'undefined')
      return cb(io('http://localhost:3002'));

    $.getScript('https://cdn.socket.io/socket.io-1.4.3.js', function() {
      cb(io('http://localhost:3002'));
    });
  },
  getRotationServerPort: function() {
  	return '3002';
  },
  getRotationServerIPAddress: function() {
  	return 'localhost/';
  }
};

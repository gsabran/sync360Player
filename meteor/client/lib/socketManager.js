export const Socket = {
  // create a new channel and initiate the socket if necessary, and execute cb when possible
  create: function(rotationServerIPAddress, rotationServerPort, cb) {
    if (typeof io !== 'undefined')
      return cb(io('http://' + rotationServerIPAddress + ':' + rotationServerPort));

    $.getScript('https://cdn.socket.io/socket.io-1.4.3.js', function() {
      cb(io('http://' + rotationServerIPAddress + ':' + rotationServerPort));
    });
  },
  getRotationServerPort: function() {
  	return '8080';//
  },
  getRotationServerIPAddress: function() {
  	return 'localhost';
  }
};

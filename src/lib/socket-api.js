var socket_io = require('socket.io');
var util = require('../lib/utility');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('disconnect', () => {
    	console.log('A user Disconnected');
    });	
});

socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
};

// send live data to front end to update the table
socketApi.updateMonitorData = function(obj) {
	if (util.isJSObjectEmpty(obj)) {
		console.log("Issue! Receiving empty data");
	} else {
		io.sockets.emit('new_monitor_data', { data: JSON.stringify(obj.data) });
	}
};

// send live data to front end to update the table
socketApi.updateTrashBinLevelData = function(obj) {
	if (util.isJSObjectEmpty(obj)) {
		console.log("Issue! Receiving empty data");
	} else {
		io.sockets.emit('new_bin_data', { data: JSON.stringify(obj) });
	}
};

module.exports = socketApi;
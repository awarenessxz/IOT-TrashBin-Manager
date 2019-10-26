module.exports = function(io){
	var express = require('express');
	var router = express.Router();
	
	io.on('connect', function(socket) {
		console.log("connected to db webpage");
		
		/* For Debugging Purposes */
		socket.on('message', function(message) {
			console.log('Client message ' + message);
		});

		const { Client } = require('pg');
		const client2 = new Client({
			connectionString: process.env.DATABASE_URL
		});

		client2.connect()
		client2.query('LISTEN events');
		client2.on('notification', function(msg) {
				console.log("Notification from db received");
				socket.emit('message', msg);
				console.log("Message sent to client");
			});

	});
	
	const { Client } = require('pg')
	const client = new Client({
		connectionString: process.env.DATABASE_URL
	})
	
	/* SQL Query */ 
	var sql_query = 'SELECT * FROM SensorData ORDER BY dt DESC';
	client.connect()
	router.get('/', function(req, res, next) {
		//client.connect()
		client.query(sql_query, (err, data) => {
			res.render('history', { 
				title: 'Data Received from Sensors', 
				data: data.rows 
			});
		});
	});
return router;
}



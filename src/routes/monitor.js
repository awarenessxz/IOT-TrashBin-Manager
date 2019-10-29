var express = require('express');
var router = express.Router();
var socketApi = require('../lib/socket-api');
var util = require('../lib/utility');

/********** Setting up listener for database update *******/
const { Client } = require('pg');
const client = new Client({
	connectionString: process.env.DATABASE_URL
});
client.connect();
const query = client.query('LISTEN incoming_data');

// database trigger activated!
client.on('notification', async(data) => {
	const obj = JSON.parse(data.payload);		// convert to javascript object
	//console.log('row added!', payload);
	socketApi.updateUIData(obj);				// emit data to web front end
});
/**********************************************************/

/* Getting information from database */
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'SELECT * FROM SensorData ORDER BY dt DESC';

router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
		res.render('monitor', { 
			title: 'Monitor Sensor Data', 
			data: data.rows 
		});
	});
});

module.exports = router;

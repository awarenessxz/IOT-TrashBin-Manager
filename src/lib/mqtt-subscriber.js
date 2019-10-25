/* MQTT Subscriber that reads sensor data from broker and add into the database */
var mqtt = require('mqtt')

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

function startSubscribing() {
	//var client  = mqtt.connect('mqtt://<user>:<password>@m11.cloudmqtt.com:10424');
	var client = mqtt.connect("mqtt://34.87.68.246", 1883);
	// callback on client connect
	client.on('connect', function () {
		console.log('client connected');
		client.subscribe('bin/#')
	});
	// callback on receving message
	client.on('message', function (topic, message) {
		console.log('message received');

		// prepare sql statement
		sql_query = 'INSERT INTO SensorData VALUES($1, $2, NOW())';

		// Query
		pool.query(sql_query, [topic.toString(), message.toString()], (err, data) => {
			if (err) {
				//console.log(err);
			} else {
				console.log(topic.toString() + " : " + message.toString() + " inserted into database");
			}
		});
	});
}

module.exports = {
	startSubscribing
}
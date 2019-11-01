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
		console.log('Server is connected to MQTT Broker. Subscribing info now...');
		client.subscribe('bin/#')
	});
	// callback on receving message
	client.on('message', function (topic, message) {
		console.log('MQTT Subscriber: message received: [' + topic.toString() + '] -- [' + message.toString() + ']');

		var bin_id = topic.toString();

		// prepare sql statement
		var sql_query = "";
		var topic_arr = topic.toString().split('/');

		if (topic_arr.slice(-1)[0] === 'status') {
			sql_query = 'UPDATE TrashBinInfo SET status = $2 WHERE bin_id = $1';
			bin_id = topic_arr.slice(0, -1).join('/')
		} else {
			sql_query = 'INSERT INTO SensorData VALUES($1, $2, NOW())';
		}

		console.log(bin_id);

		// Query
		pool.query(sql_query, [bin_id, message.toString()], (err, data) => {
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
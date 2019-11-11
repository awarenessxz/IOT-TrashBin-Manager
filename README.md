# IOT-TrashBin-Manager
IOT Network project on trash bin management incorporating proximity sensors. 

# Environment

## Design
![Architecture](src/public/images/architecture.png) 

*Note: The MQTT Broker can be a MQTT Service like CloudMQTT or a Raspberry Pi with Mosquitto installed on it or another other available MQTT Broker*

## Equipment 
- Ultrasonic Sonic (HC-SR04)
- Raspberry Pi 

## Technologies
- Express (Node.js web application framework)
- Python 3
- Postgresql 
- Mosquitto / CloudMQTT

# Setting up

## 1) MQTT Client (Subscriber/Publisher)

In this project, there are two main MQTT client namely "Raspberry Pi with Proximity Sensor" and "Web Server". The Raspberry Pi will be publishing the sensor data to the MQTT broker and the Web Server will be subscribing to the MQTT broker for the sensor data.

- **Raspberry Pi with Proximity Sensor**
	1. `sensor/getSensorData.py` - MQTT Publisher script which sends data to the Broker. This script will be added into the Raspberry Pi with the Proximity sensor. **Update the codes here if there are any changes to the MQTT broker's address.**
	1. To set up the Raspberry pi with proximity sensor, connect the following pins from the pi to the sensor
		- 5V from Pi to VCC 
		- Ground from Pi to GND
		- GPIO from Pi to Trig
		- GPIO from Pi to Echo

- **Web Server**
	1. `src/lib/mqtt-subscribber.js` - MQTT Subscriber script which the web server uses to receive data from the Broker. **Update the codes here if there are any changes to the MQTT broker's address.**

- **Testing**
	1. `sensor/sensor_mimic.py` - MQTT Publisher script which mimics the sensors sending data to the broker for the purpose of testing.

## 2) MQTT Broker

We can either install Mosquitto on a machine/raspberry pi to use as our broker or we can use cloudmqtt which is a globally distributed MQTT broker.

- **Setting up Mosquitto on Machine/Raspberry Pi**
	1. Follow the steps in this [guide](http://www.steves-internet-guide.com/mosquitto-broker/)
	2. Edit the following codes in all the MQTT Client above to connect to the broker
		- Python codes to connect to broker
			```python
			broker_address = "server"
			port = 1883
			client = mqtt.Client()
			client.on_connect = on_connect
	    	client.on_message = on_message
			client.connect(broker_address, port=port, keepalive=60)
			```
		- Nodejs codes to connect to broker
			```nodejs
			var client = mqtt.connect("mqtt://<IP_ADDRESS/HOSTNAME>", 1883);
			```

- **Setting up CloudMQTT**
	1. Go to [CloudMQTT](https://www.cloudmqtt.com/) to create an account.
	2. Follow the procedure to create an instance. Obtain the important credentials: **server, user, password, port**
	3. Edit the following codes in all the MQTT Client above to connect to the broker
		- Python codes to connect to broker
			```python
			broker_address = "something.cloudmqtt.com"
			port = 14444
			user = "user"
			password = "password"
			client = mqtt.Client()
			client.on_connect = on_connect
	    	client.on_message = on_message
			client.connect(broker_address, port=port, keepalive=60)
			```
		- Nodejs codes to connect to broker
			```nodejs
			var client  = mqtt.connect('mqtt://<user>:<password>@<broker_address>:<port>');
			```

## 3) Web Server + Database
1. [Install NodeJS](https://nodejs.org/en/).
1. [Install PostgreSQL](https://www.postgresql.org/).
1. git clone this repo and cd into repo.
1. Ensure that python is installed.
	- Install the required python libraries: `pip install -r requirements.txt` 
1. cd `src`
1. Start up the database
	- Start up `psql` terminal
	- create a file named `.env` in the current directory (src) and add the following in the file
		- `DATABASE URL=postgres://username:password@host address:port/database_name`
	- in the psql terminal, **run `\i '[path_to_this_repo]/setup.sql'` to set up the database**
1. Start the server
	- Install the required node packages: `npm install`
	- run the server: `node bin/www`

# Hosting the Web Server on Heroku

To host the webserver on Heroku, refer to folder `heroku-setup` in the `herokuHost` branch

# IMPORTANT NOTES:
1. Templates
	- Refer to `pyScriptingTemplate.js` and `pyScriptingTemplate.ejs` on how to interact with python script output
	- Refer to `psqlTemplate.js` and `psqlTemplate.ejs` on how to interact with the database
1. **When setting up the sensors and bin, we will have to manually insert the bin height into the database TrashBinInfo in order for sensor to detect the fullness.**

# Acknowledgement / Reference
- Integrating Python with Nodejs
	- https://www.freecodecamp.org/news/how-to-integrate-a-python-ruby-php-shell-script-with-node-js-using-child-process-spawn-e26ca3268a11/
	- https://medium.com/geoblinktech/evolution-of-calling-python-from-node-4369a84f22c7
- Web Template
	- https://github.com/uxcandy/Label-Free-Bootstrap-Admin-Template/tree/master/src
- Integrating MQTT with Nodejs
	- https://devblog.axway.com/apis/api-builder-and-mqtt-for-iot-part-1/
	- https://medium.com/@alifabdullah/using-mqtt-protocol-with-node-js-f0eb8065b5b6
	- https://techtutorialsx.com/2017/04/14/python-publishing-messages-to-mqtt-topic/
- Real time update
	- https://stackoverflow.com/questions/24609991/using-socket-io-in-express-4-and-express-generators-bin-www
	- https://medium.com/@ederng/psql-event-triggers-in-node-js-ec27a0ba9baa
	- https://codeforgeek.com/eventemitter-node-js/
	- https://codeforgeek.com/real-time-app-socket-io/
	- https://nodejs.org/de/docs/guides/timers-in-node/
- Detecting Distance
	- https://www.sensingthecity.com/detecting-a-full-garbage-bin-using-an-ultrasonic-distance-sensor/
	- https://www.hackster.io/arbazhussain/distance-calculation-with-ultrasonic-sensor-26d63e
- Trash bin icon
	- https://www.flaticon.com/authors/smashicons
- Last Will / Connect / Disconnect
	- https://mntolia.com/mqtt-last-will-testament-explained-with-examples/
	- https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/
	- http://www.steves-internet-guide.com/checking-active-mqtt-client-connections/
	- http://www.steves-internet-guide.com/mqtt-last-will-example/


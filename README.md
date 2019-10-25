# IOT-TrashBin-Manager
IOT Network project on trash bin management incorporating proximity sensors. 

# Environment

## Design
![Architecture](src/public/images/architecture.png) 

## Equipment 
- Ultrasonic Sonic (HC-SR04)
- Raspberry Pi 

## Technologies
- Express (Node.js web application framework)
- Python 3
- Postgresql 
- Mosquitto / CloudMQTT

# Setting up

## 1) MQTT Broker

We can either install Mosquitto on a machine/raspberry pi to use as our broker or we can use cloudmqtt which is a globally distributed MQTT broker.

- **Setting up Mosquitto on Machine/Raspberry Pi**

- **Setting up CloudMQTT**
	1. Go to [CloudMQTT](https://www.cloudmqtt.com/) to create an account.
	2. Follow the procedure to create an instance. Obtain the important credentials: **server, user, password, port**
	3. Python codes to connect to broker
		```
		broker_address = "server"
		port = 14444
		user = "user"
		password = "password"
		client = mqtt.Client()
		
		client.on_connect = on_connect
    	client.on_message = on_message
		client.connect(broker_address, port=port, 60)
		```
	4. Nodejs codes to connect to broker
		```
		```


	For python subscriber / publisher, refer to `sensor/sensor_mimic.py`
		- replace **broker address, user, password, port** with the credentials obtains from cloudmqtt
	4. For nodejs subscriber, refer to `src/lib/mqtt-subscriber.js`
		- `var client  = mqtt.connect('mqtt://<user>:<password>@m11.cloudmqtt.com:10424');` -- use this to connect to cloudmqtt broker.

	5. asd
		```python
		asd
		asd
		```

## 2) MQTT Client (Subscriber/Publisher)

1. `sensor/getSensorData.py` - MQTT Publisher script which sends data to the Broker. This script will be added into the Raspberry Pi with the Proximity sensor.
2. `sensor/sensor_mimic.py` - MQTT Publisher script which mimics the sensors sending data to the broker for the purpose of testing.
3. `src/lib/python/mqtt-subscribber.js` - MQTT Subscriber script which receive data from the Broker.

## 3) Web Server 
1. [Install NodeJS](https://nodejs.org/en/).
2. git clone this repo
3. Ensure that python is installed.
	- Install the required python libraries: `pip install -i requirements.txt` 
4. cd `src`
4. Start up the database
	- run `psql` terminal
	- create a file named `.env` in the current directory (src) and add the following in the file
		`DATABASE URL=postgres://username:password@host address:port/database name`
	- in the psql terminal, run `\i '[path_to_this_repo]/setup.sql'`
5. Start the server
	- cd `src`
	- Install the required node packages: `npm install`
	- run the server: `node bin/www`

# Hosting the Web Server on Heroku

To host the webserver, refer to the `herokuHost` branch

# IMPORTANT NOTES:
1. Add python scripts into `lib/python` folder. 
2. Templates
	- Refer to `pyScriptingTemplate.js` and `pyScriptingTemplate.ejs` on how to interact with python script output
	- Refer to `psqlTemplate.js` and `psqlTemplate.ejs` on how to interact 
3. To add a new page, look at `app.js`, look for comment ADD NEW PAGE

# Reference
- Integrating Python with Nodejs
	- https://www.freecodecamp.org/news/how-to-integrate-a-python-ruby-php-shell-script-with-node-js-using-child-process-spawn-e26ca3268a11/
	- https://medium.com/geoblinktech/evolution-of-calling-python-from-node-4369a84f22c7
- Web Template
	- https://github.com/uxcandy/Label-Free-Bootstrap-Admin-Template/tree/master/src
- Integrating MQTT with Nodejs
	- https://devblog.axway.com/apis/api-builder-and-mqtt-for-iot-part-1/
	- https://medium.com/@alifabdullah/using-mqtt-protocol-with-node-js-f0eb8065b5b6
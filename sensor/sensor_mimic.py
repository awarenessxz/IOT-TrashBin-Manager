import paho.mqtt.client as mqtt
import time 

'''
	callback for when Paho MQTT connects to MQTT Broker
	@ Params:
		client = Instance of Paho MQTT client library
		userdata = Private user data that can be set in the MQTT client() constructor
		flags = A dictionary containing flags returned by the broker. Not used here
		rc = 0 - OK
			 1 - Connection refused, incorrect protocol version
			 2 - Connection refused, invalid client identifier
			 3 - Connection refused, service not available
			 4 - Connection refused, bad user name and password
			 5 - Connection refused, not authorized
'''
def on_connect(client, userdata, flags, rc):
	print("Connected with result code " + str(rc))
	if rc == 0:
		client.publish("bin/sensor1/status", payload="Online", qos=1, retain=True)		# can only set 1 last will for each client
		#client.subscribe("bin/#")

'''
	callback whenever a new message comes in
'''
def on_message(client, userdata, msg): 
	print(msg.topic + " " + str(msg.payload))


if __name__ == '__main__':
	# Create instance
	client = mqtt.Client()

	# Set Address and Port
	broker_address = "farmer.cloudmqtt.com"     
	port = 14530										# Port 1883 default for MQTT Protocol

	# Set password for CloudMQTT                               
	user = "gbqekcke"                           		# only for cloudmqtt
	password = "i5eXt5BTsRmK"                  			# only for cloudmqtt
	client.username_pw_set(user, password=password) 	# only for cloudmqtt

	# Attach function to callback
	client.on_connect = on_connect
	client.on_message = on_message

	# Set last will message
	client.will_set("bin/sensor1/status", payload="Offline", qos=1, retain=True)	# can only set 1 last will for each client

	# Connect to the Broker
	print("Connectin....")
	client.connect(broker_address, port=port, keepalive=60)

	# Codes for Subscribing -- waiting for data
	client.loop_start()
	#client.loop_forever()

	# Codes for Publishing -- sending data
	# initializing the bins
	for x in range(10):
		client.publish("bin/sensor1", 10)			# send data for empty bin (maximum height)
		client.publish("bin/sensor2", 10)			# send data for empty bin (maximum height)
		time.sleep(1)
	# Send data continuously 
	distance = 0;
	counter = 5;									# ensures distance is consistent for 5 times
	while True:
		client.publish("bin/sensor1", 5)			# sensor stays consistent
		client.publish("bin/sensor2", distance)		# sensor goes up to max then 0 then repeats

		# update height
		if counter <= 0:
			distance -= 2
			if distance < 0:
				distance = 10						# hardcoded at 10
			counter = 5								# reset counter 5
		else:
			counter -= 1							

		time.sleep(10)














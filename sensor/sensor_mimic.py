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
			 2 – Connection refused, invalid client identifier.
			 3 – Connection refused, service not available.
			 4 – Connection refused, bad user name and password. 
			 5 – Connection refused, not authorized.
'''
def on_connect(client, userdata, flags, rc):
	print("Connected with result code " + str(rc))
	client.subscribe("bin/#")

'''
	callback whenever a new message comes in
'''
def on_message(client, userdata, msg): 
	print(msg.topic + " " + str(msg.payload))


if __name__ == '__main__':
	client = mqtt.Client()
	client.on_connect = on_connect
	client.on_message = on_message

	print("Connectin....")
	client.connect("34.87.68.246", 1883, 60)
	#client.loop_forever()

	while True:
		client.publish("bin/sensor1", 5)
		time.sleep(10)





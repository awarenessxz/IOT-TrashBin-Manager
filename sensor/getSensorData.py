import RPi.GPIO as GPIO                    #Import GPIO library
import time                                #Import time library
import paho.mqtt.client as mqtt

TRIG = 18									#Associate pin 18 to TRIG
ECHO = 24									#Associate pin 24 to ECHO
BROKER_IP = "34.87.68.246"					#IP address of mqtt broker that the sensor data will be published to

def on_connect(client, userdata, flags, rc):
  print("Connected with result code " + str(rc))
  #client.subscribe("bin/#")
  client.publish("bin/sensor1/status", payload="Online", qos=1, retain=True)

def on_message(client, userdata, msg):
  print(ms.topic + " " + str(msg.payload))

def setup_sensor():
  GPIO.setmode(GPIO.BCM)                     #Set GPIO pin numbering 
  GPIO.setup(TRIG,GPIO.OUT)                  #Set pin as GPIO out
  GPIO.setup(ECHO,GPIO.IN)                   #Set pin as GPIO in

def run_sensor(client):
  while True:

    GPIO.output(TRIG, False)                 #Set TRIG as LOW
    time.sleep(2)                            #Delay of 2 seconds to wait for sensor to settle

    GPIO.output(TRIG, True)                  #Set TRIG as HIGH
    time.sleep(0.00001)                      #Delay of 0.00001 seconds
    GPIO.output(TRIG, False)                 #Set TRIG as LOW

    while GPIO.input(ECHO)==0:               #Check whether the ECHO is LOW
      pulse_start = time.time()              #Saves the last known time of LOW pulse

    while GPIO.input(ECHO)==1:               #Check whether the ECHO is HIGH
      pulse_end = time.time()                #Saves the last known time of HIGH pulse 

    pulse_duration = pulse_end - pulse_start #Get pulse duration to a variable

    distance = pulse_duration * 17150        #Multiply pulse duration by 17150 to get distance
    distance = round(distance, 2)            #Round to two decimal points

    if distance > 2 and distance < 400:      #Check whether the distance is within range
      print "Distance:", distance - 0.5,"cm"  #Print distance with 0.5 cm calibration
      #client.publish("hello/test", distance-0.5)
      client.publish("bin/sensor1", distance-0.5)
 
    else:
      print "Out Of Range"                   #Display out of range

if __name__ == '__main__':
  setup_sensor()

  client = mqtt.Client()
  client.on_connect = on_connect
  client.on_message = on_message
  client.will_set("bin/sensor1/status", payload="Offline", qos=1, retain=True)
  print("Connecting to broker on IP " + BROKER_IP)
  client.connect(BROKER_IP, 1883, 60)
  client.loop_start()

  run_sensor(client)

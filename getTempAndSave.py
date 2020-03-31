#necessary imports
#================================================
import paho.mqtt.client as mqttClient
import time
import pymysql
 
#================================================
# mqtt functions 
def on_connect(client, userdata, flags, rc):
 
    if rc == 0:
 
        print("Connected to broker")
 
        global Connected                #Use global variable
        Connected = True                #Signal connection 
 
    else:
 
        print("Connection failed")
 
def on_message(client, userdata, message):
    temp = message.payload.decode("utf-8")
    print(temp)
    writeInDatabase(temp)

#==================================================
#mysql functions

def writeInDatabase(temp):
    db = pymysql.connect(db='tempandhum', user='root', passwd='', unix_socket="/var/mysqld/mysql.sock")
    db.begin()
    print("hsllo")
    db = pymysql.connect()
    cursor = db.cursor()
    sql = "INSERT INTO TempandHum (temp,hum) values ('%temp','40')"
    try:
        cursor.execute(sql)
        db.commit()
    except:
        db.rollback()
    db.close()


Connected = False #global variable for the state of the connection
 
broker_address= "localhost"
port = 1883

client = mqttClient.Client("Python")

client.on_connect = on_connect
client.on_message = on_message

client.connect(broker_address,port,60)
client.loop_start()

while Connected != True:    #Wait for connection
    time.sleep(0.1)
 
client.subscribe("home/laborTemp")

try:
    while True:
        time.sleep(1)
 
except KeyboardInterrupt:
    print ("exiting")
    client.disconnect()
    client.loop_stop()
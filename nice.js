fs = require('fs');
fs.writeFile('helloworld.txt', '', function (err) {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
});
var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
var Topic = 'home/laborTemp'; //subscribe to all topics
var Broker_URL = 'mqtt://10.0.0.69';
var Database_URL = 'localhost';

var options = {
	clientId: 'MyMQTT',
	port: 1883,
	//username: 'mqtt_user',
	//password: 'mqtt_password',	
	keepalive : 60
};

var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    //console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    //console.log("Subscribed to " + Topic);
    if (err) {}
};

function mqtt_reconnect(err) {
    //console.log("Reconnect MQTT");
    //if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
};

function mqtt_error(err) {
    //console.log("Error!");
	//if (err) {console.log(err);}
};

function after_publish() {
	//do nothing
};

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) 
{
	var message_str = message.toString(); //convert byte array to string
	message_str = message_str.replace(/\n$/, ''); //remove new line
	//payload syntax: clientID,topic,message
	//console.log(message_str)
	fs.appendFile('helloworld.txt', message_str, function (err) 
	{
		if (err) throw err;
		//console.log('Saved!');
	  }); 
	insert_message(topic, message_str, packet);
};

function mqtt_close() 
{
	//console.log("Close MQTT");
};

////////////////////////////////////////////////////
///////////////////// MYSQL ////////////////////////
////////////////////////////////////////////////////
var mysql = require('mysql'); //https://www.npmjs.com/package/mysql
//Create Connection
var connection = mysql.createConnection({
	host: Database_URL,
	//socketPath: '/run/mysqld/mysqld.sock',
	user: "root",
	password: "Passw0rt",
	database: "tempandhum"
});

/*connection.connect(function(err) 
{
	if (err) throw err;
	console.log("Database Connected!");
});*/
connection.connect();

//insert a row into the tbl_messages table
function insert_message(topic, message_str, packet) 
{
	var message_arr = extract_string(message_str); //split a string into an array
	//var clientID= message_arr[0];
	var temp = message_arr[0];
	var hum = message_arr[1];
	var sql = "INSERT INTO ?? (??,??) VALUES (?,?)";
	var params = ['TempandHum', 'temp', 'hum', temp, hum];
	sql = mysql.format(sql, params);
	//console.log(sql);	
	//console.log(connection);
	
	connection.query(sql, function (error, results) 
	{
		if (error) throw error;
		//console.log("Message added: " + message_str);
	}); 
};	

//split a string into an array of substrings
function extract_string(message_str) 
{
	var message_arr = message_str.split(","); //convert to array	
	return message_arr;
};	

//count number of delimiters in a string
var delimiter = ",";
function countInstances(message_str) 
{
	var substrings = message_str.split(delimiter);
	return substrings.length - 1;
};
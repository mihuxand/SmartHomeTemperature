var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'alex',
  password : 'alex',
  database : 'tempandhum'
});
 
connection.connect();
 
connection.query('SELECT * from TempandHum', function (error, results, fields) 
{
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();


var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.0.0.69')
client.subscribe("home/laborTemp")
client.on('message', mqtt_messsageReceived);

function mqtt_messsageReceived(topic, message, packet) 
{
    // message is Buffer
    console.log(message.toString())
    //client.end()
}


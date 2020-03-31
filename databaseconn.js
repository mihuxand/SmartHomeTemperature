var mysql = require('mysql2'); //https://www.npmjs.com/package/mysql
//Create Connection
var connection = mysql.createConnection({
	host: "localhost",
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
//connection.connect();
//insert_message();
select();
//insert a row into the tbl_messages table
function insert_message(topic, message_str, packet) 
{
	var message_arr = extract_string(message_str); //split a string into an array
	//var clientID= message_arr[0];
	var message = message_arr[0];
	var sql = "INSERT INTO ?? (??,??) VALUES (?,??)";
	var params = ['TempandHum', 'temp', 'hum', message, '45'];
	sql = mysql.format(sql, params);
	console.log(sql);	
	console.log(connection);
	
	connection.query(sql, function (error, results) 
	{
		if (error) throw error;
		console.log("Message added: " + message_str);
	}); 
};
function select()
{
    var sql = "SELECT * FROM TempandHum"
    connection.query(sql,function (error, result,fields) 
	{
		if (error) throw error;
		console.log(result);
	});
}

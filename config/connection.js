var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "r4919aobtbi97j46.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	port: 3306,
	user: "ymfk4ayks83sfpim",
	password: "cojuszvjb1jomyj6",
	database: "vqwiw01lm4p69ljk"
});

connection.connect(function (err) {
	if (err) {
		console.error("error connecting: " + err.stack);
		return;
	}
	console.log("connected as id " + connection.threadId);
});

module.exports = connection;

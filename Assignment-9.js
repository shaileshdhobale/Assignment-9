// include all modules
var mongo = require('mongodb');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var host = "127.0.0.1";
var port = 27017;


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
// On get request it will display signup form
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});
// On post request it will check mail id present in the database or not 
app.post('/',urlencodedParser, function (req, res) {
	var db = new mongo.Db("Users-db", new mongo.Server(host, port, {}));
	db.open(function(error) {
	    console.log("WE are Connected! "+ host + ":"  +port);
	    db.collection("Users", function (error, collection ){
	   		console.log("We created Users collection.");
	   		collection.find({"email":req.body.email}, function(error, cursor) {
	   			cursor.toArray(function(error, users){
	   				// mail id not present then it will insert the record into the database
	   				if(users.length == 0){
	   					collection.insert({
	   						email : req.body.email,
	   						fname : req.body.fname,
	   						lname : req.body.lname,
	   						country : req.body.country,
	   						state : req.body.state,
	   						phone : req.body.pno
	   					});
	   					res.end("Saved");
	   				} else {
	   					console.log(users);
	   					res.end("Already User exist");
	   				}
	   			});
	   		});
	    });
	});

});
var server = app.listen(8080);
console.log("Example app listening");
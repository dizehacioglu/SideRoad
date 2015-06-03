var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://heroku_app37479949:30boehbjbsq593slfhp30358g9@ds031872.mongolab.com:31872/heroku_app37479949")


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);
app.post('/renderLocation', indexController.renderLocation);

var port = process.env.PORT || 9849;

var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});

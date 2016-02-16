var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var compress = require('compression');



if (process.env.NODE_ENV == undefined ) {
	var config 	   = require('./config/auth');
}

var path 	     = require('path');

app.use(compress());
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(morgan('dev'));



mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/lucid'); //  config.database

app.use(express.static(__dirname + '/public'));

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// PLACE SPLIT UP API HERE . THIS: https://github.com/strongloop/express/blob/master/examples/route-separation/index.js

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(process.env.PORT || 8080); // process.env.PORT || config.port
console.log('App running');

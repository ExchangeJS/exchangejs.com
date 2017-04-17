// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

var routes = require('./routes/index');

var session = require('express-session');
var keystone = require('keystone');
var moment = require('moment');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('hbs', hbs.express3());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ### Date Helper
// A port of the Ghost Date formatter similar to the keystonejs - jade interface
//
//
// *Usage example:*
// `{{date format='MM YYYY}}`
// `{{date publishedDate format='MM YYYY'`
//
// Returns a string formatted date
// By default if no date passed into helper than then a current-timestamp is used
//
// Options is the formatting and context check this.publishedDate
// If it exists then it is formated, otherwise current timestamp returned
hbs.registerHelper('date', function(context, options) {
	if (!options && context.hasOwnProperty('hash')) {
		options = context;
		context = undefined;

		if (this.publishedDate) {
			context = this.publishedDate;
		}
	}

	// ensure that context is undefined, not null, as that can cause errors
	context = context === null ? undefined : context;

	var f = options.hash.format || 'MMM Do, YYYY',
		timeago = options.hash.timeago,
		date;

	// if context is undefined and given to moment then current timestamp is given
	// nice if you just want the current year to define in a tmpl
	if (timeago) {
		date = moment(context).fromNow();
	} else {
		date = moment(context).format(f);
	}
	return date;
});

app.use(session({
	secret: process.env.COOKIE_SECRET
}));


keystone.init({
	'env': process.env.NODE_ENV,
	'mongo': process.env.MONGO_URI,
	'url': process.env.URL,

	'name': 'ExchangeJS',

	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User'
});
// Load your project's Models
keystone.import('models');

keystone.set('app', app);

app.use('/', routes(keystone));

app.use('/keystone', require('keystone/admin/server/app/createStaticRouter.js')(keystone));
app.use('/keystone', require('keystone/admin/server/app/createDynamicRouter.js')(keystone));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
	switch(err.status) {

	case 404:
		res.status(404);
		res.render('error', {
			message: '404. The page you are looking for cannot be found.'
		});
		break;

	default:
		res.status(500);
		res.render('error', {
			message: 'Internal server error. The page cannot be rendered.'
		})
	}
});

keystone.start();

// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

var routes = require('./routes/index');

var session = require('express-session');
var keystone = require('keystone');

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

// add 404 routes

keystone.start();

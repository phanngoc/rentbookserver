require("babel-register");
require("babel-polyfill");
if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

/**
 * Module dependencies.
 */

const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

// const expressStatusMonitor = require('express-status-monitor');
const lessMiddleware = require('less-middleware');

const upload = require('./config/upload');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */

const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.use(expressStatusMonitor());
app.use(compression());

app.use(lessMiddleware(path.join(__dirname + '/public')));
app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var bootstrap = require('./bootstrap/bootstrap');
bootstrap(app);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload' || req.path.match(/api/g)) {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

/* code autoload and attach database */
var load = require('express-load');

load('middleware')
  .then('controllers')
  .then('routes')
  .into(app);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Error Handler.
 */
app.use(errorHandler());

var server = require('http').Server(app);
var io = require('socket.io')(server);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});


io.on('connection', function(socket){

  var userSend = socket.decoded;
  var userReceive = socket.handshake.query.user_id;
  socket.emit('news', { hello: 'world' });
  socket.on('messages', function(data) {

  });
});

io.listen(3001);

var jwt = require('jsonwebtoken');

io.use(function(socket, next){
  var token = socket.handshake.query.token;

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.KEY_SECRET, function(err, decoded) {
      if (err) {
        next(new Error("not authorized"));
      } else {
        // if everything is good, save to request for use in other routes
        socket.decoded = decoded;
        next();
      }
    });

  } else {
    next(new Error("not authorized"));
  }

});

module.exports = app;

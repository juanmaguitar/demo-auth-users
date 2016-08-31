const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const config = require('./config');
const admin = require('./routes/admin');
const mongoose = require('mongoose');

const auth = require('./auth/routes');
const passport = require('passport');

const users = require('./users/routes');
const ensureAdmin = require('./auth/middlewares').ensureAdmin;

const app = express();

const NODE_ENV = process.env.NODE_ENV || app.get('env');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.set('dbUrl', config.db[NODE_ENV]);
mongoose.connect(app.get('dbUrl'));



app.get('/add/:first/:second', function (req, res) {
  // convert the two values to floats and add them together
  var sum = parseFloat(req.params.first) + parseFloat(req.params.second);
  res.status(200).send(String(sum))
});

//... routes
app.post('/signup', users.signup);
app.post('/auth/local', auth.local);
app.get('/admin', ensureAdmin, admin.index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (NODE_ENV === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

if (NODE_ENV != 'test') {
  app.use(logger('dev'));
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

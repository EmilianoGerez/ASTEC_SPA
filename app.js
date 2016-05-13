var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

// Register models
var userModel = require('./models/user.model');
var refreshToken = require('./models/refreshToken.model');
var counterModel = require('./models/counter.model.server');
var orderModel = require('./models/order.model.server');
var clientModel = require('./models/client.model.server');

// Mogoose DB
var configDB = require('./configs/db.server.config');
mongoose.connect(configDB.devUrl, function(err){
  if(err)
    console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

// Routes and routes middleware
var routes = require('./routes/index');
var users = require('./routes/users');
var clients = require('./routes/client.routes.server');
var orders = require('./routes/order.routes.server');


app.use('/', routes);
app.use('/api/users', users);
app.use('/api/clients', clients);
app.use('/api/orders', orders);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
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

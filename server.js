var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongo = require('mongoose');
var config = require('./config/database');
var api = require('./routes/api');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({'extended':'false', limit:'5mb'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  mongo.Promise = require('bluebird');
  mongo.connect(config.database, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

module.exports = app;
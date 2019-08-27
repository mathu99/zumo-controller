var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongo = require('mongoose');
var Song = require("../zumo-controller/models/song");

var db = mongo.connect('mongodb://admin:manage01@ds213178.mlab.com:13178/zumo-config', function(err, response) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to db');
    }
});

var app = express();
app.use(bodyParser());
app.use(logger('dev'));
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/api/songs", function(req, res) {
    Song.find({}, function (err, songs) {
        if (err) {
            res.send(400, 'No Songs Found');
        } else {
            res.send(songs);
        }
    });
});

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

module.exports = app;
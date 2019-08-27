var express = require('express');
var router = express.Router();
var Song = require("../models/song");

router.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.get('/', function (req, res, next) {
    res.send('Express RESTful API');
});

router.get("/songs", function(req, res) {
    Song.find({}, function (err, songs) {
        if (err) {
            res.send(400, 'No Songs Found');
        } else {
            res.send(songs);
        }
    });
});

module.exports = router;
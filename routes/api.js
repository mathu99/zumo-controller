var express = require('express');
var router = express.Router();
var Song = require("../models/song");

router.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Accept', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/* API consumed by UI */

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

router.post('/songs', function(req, res) {
    let song = { 'selected': req.body.selected},
        query = {'trackNumber': req.body.trackNumber};
    Song.findOneAndUpdate(query, song, function(err, doc){
        if (err) {
            return res.status(500).send({ success: false, msg: 'Song save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated.' });
    })
});

/* API consumed by Arduino */

router.get("/selectedTrackNumber", function(req, res) {
    Song.find({'selected':true}, function (err, songs) {
        if (err) {
            res.send(400, 'No Songs Found');
        } else {
            if (!songs || songs.length == 0) {
                res.send('0');
            } else {
                res.send(songs[0].trackNumber.toString());
            }
        }
    });
});

module.exports = router;
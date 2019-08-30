var express = require('express');
var router = express.Router();
var Song = require("../models/song");
var Coords = require("../models/coords");

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Accept', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
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

router.post('/coords', function(req, res) {
    let query = {'zumoId': req.body.zumoId},
        coords = {
            zumoId: req.body.zumoId,
            alpha: req.body.alpha,
            beta: req.body.beta,
            gamma: req.body.gamma,
        };
    Coords.findOneAndUpdate(query, coords, {upsert:true, runValidators:true}, function(err, doc){
        if (err) {
            return res.status(500).send({ success: false, msg: 'Coords save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated coords.' });
    })
});

/* API consumed by Arduino */

router.get("/selectedTrackNumber", function(req, res) {
    Song.find({'selected':true, 'zumoId':+req.query.zumoId}, function (err, songs) {
        if (err) {
            res.send(400, 'Songs Not Found');
        } else {
            let song = {trackNumber: "0"};
            if (!songs || songs.length == 0) {
                res.send(JSON.stringify(song));
            } else {
                song.trackNumber = songs[0].trackNumber.toString();
                res.send(JSON.stringify(song));
            }
        }
    });
});

router.get("/currentCoords", function(req, res) {
    Coords.find({'zumoId':req.query.zumoId}, function (err, coords) {
        if (err) {
            res.send(400, 'Coords Not Found');
        } else {
            let resposne = {coordinates:`${coords[0].gamma}|${coords[0].beta}`};
            res.send(JSON.stringify(resposne));
        }
    });
});

module.exports = router;
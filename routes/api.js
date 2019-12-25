var express = require('express');
var router = express.Router();
var Song = require("../models/song");
var Coords = require("../models/coords");
var Config = require("../models/config");
var Email = require("../models/email");

router.use(function (req, res, next) {
    // var allowedOrigins = ['http://localhost:4200', 'http://www.focus1.co.za'];
    var origin = req.headers.origin;
    console.log(origin)
    res.setHeader('Access-Control-Allow-Origin', origin);
    // if (allowedOrigins.indexOf(origin) > -1){
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    // }
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

router.get("/songs", function (req, res) {
    Song.find({}, function (err, songs) {
        if (err) {
            res.send(400, 'No Songs Found');
        } else {
            res.send(songs);
        }
    });
});

router.get("/config", function (req, res) {
    Config.find({ zumoId: req.query.zumoId }, function (err, songs) {
        if (err) {
            res.send(400, 'No Config Found');
        } else {
            res.send(songs);
        }
    });
});

router.post('/songs', function (req, res) {
    let song = { 'selected': req.body.selected },
        query = { 'trackNumber': req.body.trackNumber };
    Song.findOneAndUpdate(query, song, function (err, doc) {
        if (err) {
            return res.status(500).send({ success: false, msg: 'Song save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated.' });
    })
});

router.post('/coords', function (req, res) {
    let query = { 'zumoId': req.body.zumoId },
        coords = {
            zumoId: req.body.zumoId,
            alpha: req.body.alpha,
            beta: req.body.beta,
            gamma: req.body.gamma,
        };
    Coords.findOneAndUpdate(query, coords, { upsert: true, runValidators: true }, function (err, doc) {
        if (err) {
            return res.status(500).send({ success: false, msg: 'Coords save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated coords.' });
    })
});

router.post('/config', function (req, res) {
    let query = { 'zumoId': req.body.zumoId },
        config = {
            zumoId: req.body.zumoId,
            speed: req.body.speed,
        };
    Config.findOneAndUpdate(query, config, { upsert: true, runValidators: true }, function (err, doc) {
        if (err) {
            return res.status(500).send({ success: false, msg: 'Config save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated config.' });
    })
});

router.post('/contact', function (req, res) {
    let query = {
        'emailAddress': req.body.emailAddress,
        'topic': req.body.topic,
    },
    contact = {
        emailAddress: req.body.emailAddress,
        topic: req.body.topic,
        name: req.body.name,
        contactNumber: req.body.contactNumber,
    };
    Email.findOneAndUpdate(query, contact, { upsert: true, runValidators: true }, function (err, doc) {
        if (err) {
            return res.status(500).send({ success: false, msg: 'contact entry save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated contact entry.' });
    })
});

router.post('/emailAddress', function (req, res) {
    let query = { 'emailAddress': req.body.emailAddress },
        email = {
            emailAddress: req.body.emailAddress,
        };
    Email.findOneAndUpdate(query, email, { upsert: true, runValidators: true }, function (err, doc) {
        if (err) {
            return res.status(500).send({ success: false, msg: 'Config save failed. ' + err });
        }
        res.json({ success: true, msg: 'Successfully updated config.' });
    })
});

/* API consumed by Arduino */

router.get('/zumoControls', function (req, res) { /* Get everything at once, seperated by pipes */
    var queries = [
        Song.find({ 'selected': true, 'zumoId': +req.query.zumoId }).exec(),
        Coords.find({ 'zumoId': req.query.zumoId }).exec(),
        Config.find({ 'zumoId': req.query.zumoId }).exec(),
    ],
        parts = [];

    Promise.all(queries).then(function ([song, coords, config]) {
        parts.push((song.length > 0 ? song[0].trackNumber.toString() : '0'));
        parts.push(coords.length > 0 ? `${coords[0].gamma}|${coords[0].beta}` : '0|0');
        parts.push(config.length > 0 ? config[0].speed : '200');
        let response = { 'zumoControls': parts.join('|') };
        res.send(JSON.stringify(response));
    }).catch(function (err) {
        res.send(400, `Error occured - ${err}`);
    });
})

router.get("/selectedTrackNumber", function (req, res) {
    Song.find({ 'selected': true, 'zumoId': +req.query.zumoId }, function (err, songs) {
        if (err) {
            res.send(400, 'Songs Not Found');
        } else {
            let song = { trackNumber: "0" };
            if (!songs || songs.length == 0) {
                res.send(JSON.stringify(song));
            } else {
                song.trackNumber = songs[0].trackNumber.toString();
                res.send(JSON.stringify(song));
            }
        }
    });
});

router.get("/currentCoords", function (req, res) {
    Coords.find({ 'zumoId': req.query.zumoId }, function (err, coords) {
        if (err) {
            res.send(400, 'Coords Not Found');
        } else {
            let resposne = { coordinates: `${coords[0].gamma}|${coords[0].beta}` };
            res.send(JSON.stringify(resposne));
        }
    });
});

module.exports = router;
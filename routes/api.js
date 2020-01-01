var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
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
    var transporter = nodemailer.createTransport({
        name: 'focus1.co.za',
        host: 'cp3.domains.co.za',
        port: '587',
        secure: false,
        auth: {
            user: 'no-reply@focus1.co.za',
            pass: '0r61lq2tLz'
        }
    });
    let mailOptions = {
        from: '"Focus1" <no-reply@focus1.co.za>',
        to: contact.emailAddress,
        subject: 'Your Query submitted on Focus1.co.za!',
        html: `<div style="margin:0;padding:0" bgcolor="#FFFFFF">
        <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en">
            <tbody>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
                <tr align="center">
                    <td>
                        <table border="0" cellspacing="0" cellpadding="0"
                            style="padding-bottom:20px;max-width:516px;min-width:220px">
                            <tbody>
                                <tr>
                                    <td width="8" style="width:8px"></td>
                                    <td>
                                        <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                                            align="center" class="m_6350944625218217992mdv2rw"><img
                                                src="https://drive.google.com/uc?export=download&id=1OajnAGDLpFUjfHerrdwJW8SQW8n6f1_Z" width="74"
                                                height="24" aria-hidden="true" style="margin-bottom:16px" alt="Focus"
                                                class="CToWUd">
                                            <div
                                                style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                                                <div style="font-size:24px">Your request has been submitted!
                                                </div>
                                                <table align="center" style="margin-top:8px">
                                                    <tbody>
                                                        <tr style="line-height:normal">
                                                            <td align="right" style="padding-right:8px"></td>
                                                            <td><a
                                                                    style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);font-size:14px;line-height:20px">${contact.emailAddress}</a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">
                                                Thanks for your submission via <a href="http://www.focus1.co.za"
                                                    target="_blank">www.focus1.co.za</a>. We'll be in touch soon! Here's a
                                                review of your request:
                                                <table width="50%" height="100%" style="margin-top:32px; min-width:348px"
                                                    border="0" cellspacing="0" cellpadding="0" lang="en">
                                                    <tbody>
                                                        <tr>
                                                            <td style="font-weight: bold">Topic:</td>
                                                            <td>${contact.topic}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-weight: bold">Name:</td>
                                                            <td>${contact.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-weight: bold">Email:</td>
                                                            <td>${contact.emailAddress}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-weight: bold">Contact Number:</td>
                                                            <td>${contact.contactNumber}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div style="padding-top:32px;text-align:center">
                                                    <a target="_blank" href="http://focus1.co.za/" style="display: inline-block;
                                                        font-weight: 400;
                                                        color: #fff;
                                                        background-color: #000;
                                                        border-color: #000;
                                                        text-align: center;
                                                        vertical-align: middle;
                                                        padding: 1rem 1.9rem;
                                                        text-decoration:none;
                                                        font-size: 1rem;
                                                        line-height: 1.5;
                                                        font-size: 0.75rem;
                                                        letter-spacing: 0.86px;
                                                        font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
                                                        font-weight: 700;
                                                        border-radius: 5rem;">
                                                        Visit Focus1</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="text-align:left">
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">
                                                <div>This is an informative message to notify you that we have recieved your
                                                    request and will process it as soon as we can.</div>
                                                <div style="direction:ltr">© 2019 Focus1, <a
                                                        class="m_6350944625218217992afal"
                                                        style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">252
                                                        Rahima Moosa Street, Hillbrow, Johannesburg, 2001</a></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td width="8" style="width:8px"></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
    mailOptions = {
        from: '"Focus1" <no-reply@focus1.co.za>',
        to: 'enquire@focus1.co.za',
        subject: `New Query submitted on Focus1.co.za (${contact.name})`,
        html: `<div style="margin:0;padding:0" bgcolor="#FFFFFF">
        <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en">
            <tbody>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
                <tr align="center">
                    <td>
                        <table border="0" cellspacing="0" cellpadding="0"
                            style="padding-bottom:20px;max-width:516px;min-width:220px">
                            <tbody>
                                <tr>
                                    <td width="8" style="width:8px"></td>
                                    <td>
                                        <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                                            align="center" class="m_6350944625218217992mdv2rw"><img
                                                src="https://drive.google.com/uc?export=download&id=1OajnAGDLpFUjfHerrdwJW8SQW8n6f1_Z" width="74"
                                                height="24" aria-hidden="true" style="margin-bottom:16px" alt="Focus"
                                                class="CToWUd">
                                            <div
                                                style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                                                <div style="font-size:24px">New Request Submitted!
                                                </div>
                                                <table align="center" style="margin-top:8px">
                                                    <tbody>
                                                        <tr style="line-height:normal">
                                                            <td align="right" style="padding-right:8px"></td>
                                                            <td><a
                                                                    style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);font-size:14px;line-height:20px">${contact.emailAddress}</a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">
                                                A new request has been submitted on <a href="http://www.focus1.co.za"
                                                    target="_blank">www.focus1.co.za</a>. Here's a summary of the details:
                                                <table width="50%" height="100%" style="margin-top:32px; min-width:348px"
                                                    border="0" cellspacing="0" cellpadding="0" lang="en">
                                                    <tbody>
                                                        <tr>
                                                            <td style="font-weight: bold">Topic:</td>
                                                            <td>${contact.topic}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-weight: bold">Name:</td>
                                                            <td>${contact.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-weight: bold">Email:</td>
                                                            <td>${contact.emailAddress}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-weight: bold">Contact Number:</td>
                                                            <td>${contact.contactNumber}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div style="padding-top:32px;text-align:center">
                                                    <a target="_blank" href="http://focus1.co.za/" style="display: inline-block;
                                                        font-weight: 400;
                                                        color: #fff;
                                                        background-color: #000;
                                                        border-color: #000;
                                                        text-align: center;
                                                        vertical-align: middle;
                                                        padding: 1rem 1.9rem;
                                                        text-decoration:none;
                                                        font-size: 1rem;
                                                        line-height: 1.5;
                                                        font-size: 0.75rem;
                                                        letter-spacing: 0.86px;
                                                        font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
                                                        font-weight: 700;
                                                        border-radius: 5rem;">
                                                        Visit Focus1</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="text-align:left">
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">
                                                <div style="direction:ltr">© 2019 Focus1, <a
                                                        class="m_6350944625218217992afal"
                                                        style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">252
                                                        Rahima Moosa Street, Hillbrow, Johannesburg, 2001</a></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td width="8" style="width:8px"></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>`,
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
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
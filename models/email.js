var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: false,
    },
    topic: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Email', EmailSchema);
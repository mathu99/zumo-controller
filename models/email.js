var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailSchema = new Schema({
    emailAddress: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Email', EmailSchema);
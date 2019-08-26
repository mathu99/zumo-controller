var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = new Schema({
    trackNumber:{
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    selected: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Song', SongSchema);
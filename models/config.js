var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    zumoId: {
        type: Number,
        required: true,
    },
    speed: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Config', ConfigSchema);
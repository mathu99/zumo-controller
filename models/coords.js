var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoordsSchema = new Schema({
    alpha:{
        type: Number,
        required: true,
    },
    beta:{
        type: Number,
        required: true,
    },
    gamma:{
        type: Number,
        required: true,
    },
    zumoId: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Coords', CoordsSchema);
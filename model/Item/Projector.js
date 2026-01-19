const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Projector', new mongoose.Schema({
    specifications: {
        lumens: String,
        lampHours: String
    },
    enumerators: {
        projectorType: {
            type: String,
            enum: [ 'Unknown', 'DLP', 'LCD', 'LED' ]
        }
    },
    faults: {
        locked: {
            type: Boolean,
            default: false
        }
    }
}));
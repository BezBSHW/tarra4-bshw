const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Phone', new mongoose.Schema({
    specifications: {
        description: String
    },
    faults: {
        screenDamage: {
            type: Boolean,
            default: false
        },
        deadBattery: {
            type: Boolean,
            default: false
        },
        locked: {
            type: Boolean,
            default: false
        }
    }
}));
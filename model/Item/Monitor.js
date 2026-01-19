const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Monitor', new mongoose.Schema({
    specifications: {
        screenSize: String
    },
    faults: {
        standMissing: {
            type: Boolean,
            default: false
        },
        screenScratched: {
            type: Boolean,
            default: false
        },
        screenDamage: {
            type: Boolean,
            default: false
        },
        glassDamage: {
            type: Boolean,
            default: false
        }
    }
}));
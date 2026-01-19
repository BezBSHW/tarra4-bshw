const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Smartphone', new mongoose.Schema({
    specifications: {
        description: String
    },
    faults: {
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
        },
        locked: {
            type: Boolean,
            default: false
        }
    }
}));
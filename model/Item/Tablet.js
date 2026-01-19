const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Tablet', new mongoose.Schema({
    specifications: {
        description: String
    },
    faults: {
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
const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Aio', new mongoose.Schema({
    specifications: {
        processor: String,
        ramSize: String,
        hardDrive: String
    },
    faults: {
        hardDriveRemoval: {
            type: Boolean,
            default: false
        },
        lanPortFault: {
            type: Boolean,
            default: false
        },
        biosLocked: {
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
        },
        standMissing: {
            type: Boolean,
            default: false
        },
        noDisplay: {
            type: Boolean,
            default: false
        }
    }
}));
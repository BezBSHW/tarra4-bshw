const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Laptop', new mongoose.Schema({
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
        missingBattery: {
            type: Boolean,
            default: false
        },
        deadBattery: {
            type: Boolean,
            default: false
        },
        lanPortFault: {
            type: Boolean,
            default: false
        },
        usbPortDamage: {
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
        noDisplay: {
            type: Boolean,
            default: false
        }
    }
}));
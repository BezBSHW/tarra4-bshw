const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Desktop', new mongoose.Schema({
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
        biosLocked: {
            type: Boolean,
            default: false
        },
        usbPortDamage: {
            type: Boolean,
            default: false
        },
        noDisplay: {
            type: Boolean,
            default: false
        }
    }
}));
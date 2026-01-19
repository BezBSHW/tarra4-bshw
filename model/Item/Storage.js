const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Storage', new mongoose.Schema({
    specifications: {
        storageType: String,
        storageDescription: String,
    },
    faults: {
        hardDriveRemoval: {
            type: Boolean,
            default: false
        }
    }
}));
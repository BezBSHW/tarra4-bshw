const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Network', new mongoose.Schema({
    specifications: {
        ports: String
    },
    enumerators: {
        networkType: {
            type: String,
            enum: [ 'unknown', 'router', 'switch', 'firewall']
        },
        speed: {
            type: String,
            enum: [ 'Unknown', '10', '100', 'gigabit', 'fiber', '10G' ],
        }
    },
    faults: {
        noisyFan: {
            type: Boolean,
            default: false
        }
    }
}));
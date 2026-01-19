const mongoose = require('mongoose');

const Item = require('../Item.js');

module.exports = Item.discriminator( 'Printer', new mongoose.Schema({
    specifications: {
        pageCount: String
    },
    enumerators: {
        inkType: {
            type: String,
            enum: [ 'ink', 'toner', 'ribbon', 'thermal' ],
        },
        colour: {
            type: String,
            enum: [ 'false', 'true' ]
        }
    },
    faults: {
        poorPrint: {
            type: Boolean,
            default: false
        },
        missingToner: {
            type: Boolean,
            default: false
        }
    }
}));
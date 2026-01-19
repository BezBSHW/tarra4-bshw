const mongoose = require("mongoose");

const baseOptions = { discriminatorKey: 'itemType' };

const itemSchema = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    identify: {
        idBarcode: String,
        serial: String,
        brand: String,
        product: String,
        version: String,
        notes: String
    },
    cosmeticCondition: {
        type: String,
        default: 'goodCondition',
        enum: ['goodCondition', 'minorCaseDamage', 'caseDamage', 'heavyCaseDamage']
    },
    globalFaults: {
        boardFault: {
            type: Boolean,
            default: false
        },
        powerFault: {
            type: Boolean,
            default: false
        }
    },
    locked: {
        type: Boolean,
        default: false
    },
    manualInput: {
        type: Boolean,
        default: true
    },
    price: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
}, baseOptions );

module.exports = mongoose.model('Item', itemSchema );
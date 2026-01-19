const mongoose = require("mongoose");


const jobSchema = new mongoose.Schema({
    fromBarcode: {
        type: String,
        required: true,
        unique: true
    },
    businessName: String,
    businessAddress: String,
    contactName: String,
    contactPhoneNumber: String,
    contactEmailAddress: String,
    notes: String,
    wipeReq: {
        type: String,
        required: true,
        default: '0',
        enum: ['0', '1']
    },
    collectionDate: String,
    wipeList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wipe'
    }],
    itemList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    created: {
        type: Date,
        default: () => { return Date.now();}
    },
    completed: {
        type: Boolean,
        default: false
    },
    completionDate: Date
});

module.exports = mongoose.model('Job', jobSchema);
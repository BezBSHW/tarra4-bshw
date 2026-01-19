const mongoose = require("mongoose");

const wipeSchema = new mongoose.Schema({
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    product: String,
    serial: String,
    size: String,
    progress: {
        type: String,
        default: "0"
    },
    started: {
        type: Boolean,
        default: false
    },
    finished: {
        type: Boolean,
        default: false
    },
    faulty: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: () => { return Date.now();}
    },
    startedDate: Date,
    finishedDate: Date,
    faultyDate: Date
});

module.exports = mongoose.model('Wipe', wipeSchema);

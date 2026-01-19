const mongoose = require("mongoose");

const processorFamilySchema = new mongoose.Schema({
    processorFamilyName: {
        type: String,
        required: true,
        unique: true
    },
    processor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Processor'
    }],
    desktop: {
        buyPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
        sellPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    },
    laptop: {
        buyPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
        sellPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    },
    aio: {
        buyPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
        sellPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    },
    imac: {
        buyPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
        sellPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    },
    macbook: {
        buyPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
        sellPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    },
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
},
    {
    toJSON: { getters: true }
});

module.exports = mongoose.model('ProcessorFamily', processorFamilySchema);
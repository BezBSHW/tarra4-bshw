const mongoose = require("mongoose");

const monitorPriceSchema = new mongoose.Schema({
    size: {
        type: Number,
        required: true,
        unique: true
    },
    buyPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    sellPrice: { type: Number, get: v => (v/100).toFixed(2), set: v => v*100 },
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
}, {
    toJSON: { getters: true }
});

module.exports = mongoose.model('MonitorPrice', monitorPriceSchema);
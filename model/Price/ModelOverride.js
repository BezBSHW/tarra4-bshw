const mongoose = require("mongoose");

const overridePriceSchema = new mongoose.Schema({
    model: {
        type: String,
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

module.exports = mongoose.model('ModelOverridePrice', overridePriceSchema);
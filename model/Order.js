const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyerName: String,
    buyerEmail: String,
    buyerPhone: String,
    buyerAddress: String,
    consignment: String,
    notes: String,
    estimatedPrice: String,
    finalPrice: String,
    locationList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }],
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
});

module.exports = mongoose.model('Order', orderSchema);
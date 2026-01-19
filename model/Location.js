const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    locate: String,
    notes: String,
    itemList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    itemType: {
        type: String,
        enum: ['Aio', 'Desktop', 'Laptop', 'Misc']
    },
    locked: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
});

module.exports = mongoose.model('Location', locationSchema);
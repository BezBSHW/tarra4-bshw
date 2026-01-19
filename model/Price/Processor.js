const mongoose = require("mongoose");

const processorSchema = new mongoose.Schema({
    model: String,
    processorFamily: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProcessorFamily'
    },
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
})

module.exports = mongoose.model('Processor', processorSchema);
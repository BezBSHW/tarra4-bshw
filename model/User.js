const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        default: true
    }, //can adjust users
    wipeR: {
        type: Boolean,
        default: true
    }, //can see wipe
    wipeE: {
        type: Boolean,
        default: true
    }, //can edit wipe
    wipeC: {
        type: Boolean,
        default: true
    }, //can create wipe
    wipeS: {
        type: Boolean,
        default: true
    }, //can see active
    jobR: {
        type: Boolean,
        default: true
    }, //can see job
    jobE: {
        type: Boolean,
        default: true
    }, //can edit job
    jobC: {
        type: Boolean,
        default: true
    }, //can create job
    jobS: {
        type: Boolean,
        default: true
    }, //can see count
    itemR: {
        type: Boolean,
        default: true
    }, //can see item
    itemE: {
        type: Boolean,
        default: true
    }, //can edit item
    itemC: {
        type: Boolean,
        default: true
    }, //can create item
    locationR: {
        type: Boolean,
        default: true
    }, //can see location
    locationE: {
        type: Boolean,
        default: true
    }, //can edit location
    locationC: {
        type: Boolean,
        default: true
    }, //can create location
    created: {
        type: Date,
        default: () => { return Date.now();}
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
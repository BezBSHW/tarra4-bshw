const express = require('express');
const router = express.Router();
const Location = require('../model/Location.js');

router.get('/list', function (req, res) {
    Location.find({ 'locked': false })
        .distinct('_id')
        .then(function(many){
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
})

router.get('/location/:locate', function (req, res) {
    Location.findOne({ 'locate': req.params.locate})
        .then(function(one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Job = require('../model/Job.js');

/**
 * Get all Jobs
 */
router.get('/', function(req, res) {
    Job.find()
        .then(function(many) {
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
});

/**
 * Find by id
 */
router.get('/:id', function (req, res) {
    Job.findById( req.params.id).then(function (one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});
/**
 * Find by fromBarcode
 */
router.get('/from/:from', function (req, res) {
    Job.findById( req.params.from)
        .then(function (one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/list', function (req, res, next) {
    Job.find( { 'completed': false } )
        .distinct( '_id')
        .then(function (many) {
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
})

module.exports = router;
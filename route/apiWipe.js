const express = require('express');
const router = express.Router();
const Wipe = require('../model/Wipe.js');
const Job = require('../model/Job.js');

router.get('/', function(req, res) {
    Wipe.find()
        .then(function(err, many) {
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/:id', function(req, res) {
    Wipe.findById(req.params.id)
        .then(function (one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/from/:from', function (req, res) {
    Job.findById(req.params.from)
        .populate('wipeList')
        .then(function(err, many) {
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/serial/:serial', function(req, res, next) {
    Wipe.findOne({ 'serial': req.params.serial })
        .then(function(one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});

router.post('/', function(req, res) {
    Wipe.create(req.body)
        .then(function (post) {
        Job.findByIdAndUpdate(req.body.fromId, {$push: {wipeList: post.id}}, {new: true})
            .then(function (post2) {
            res.json({post, post2});
        }).catch(function(err2) {
            console.log(err2);
        });
    }).catch(function(err) {
        console.log(err);
    });
});

router.put('/complete/:id', function(req, res) {
    Wipe.findByIdAndUpdate(req.params.id, { $set: { finished: true, finishedDate: Date.now() }})
        .then(function(post) {
        res.json(post);
    }).catch(function(err) {
        console.log(err);
    });
});

router.put('/started/:id', function(req, res) {
    Wipe.findByIdAndUpdate(req.params.id, { $set: { started: true, startedDate: Date.now() }})
        .then(function(post) {
        res.json(post);
    }).catch(function(err) {
        console.log(err);
    });
});

router.put('/faulty/:id', function (req, res) {
    Wipe.findByIdAndUpdate(req.params.id, { $set: { faulty: true, faultyDate: Date.now() }})
        .then(function(post) {
        res.json(post);
    }).catch(function(err) {
        console.log(err);
    });
});

router.put('/progress/:id/:progress', function (req, res) {
    Wipe.findByIdAndUpdate(req.params.id, { $set: { progress: req.params.progress }})
        .then(function(post) {
        res.json(post);
    }).catch(function(err) {
        console.log(err);
    });
});



module.exports = router;

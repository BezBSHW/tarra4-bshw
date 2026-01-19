const express = require('express');
const router = express.Router();
const Auto = require('../model/Item.js');
const Desktop = require('../model/Item/Desktop.js');
const Aio = require('../model/Item/Aio.js');
const Laptop = require('../model/Item/Laptop.js');
const Job = require('../model/Job');
const Processor = require("../model/Price/Processor.js");

router.get('/', function(req, res) {
    Auto.find({}).then(function(many) {
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/:id', function(req, res) {
    Auto.findById(req.params.id).then(function(one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/id/:idBarcode/:from', function(req, res) {
    Job.findOne({fromBarcode: req.params.from})
        .then(function(one) {
        try {
            let eyedee = one.id;
            Auto.countDocuments({ 'idBarcode': req.params.idBarcode, 'fromId': eyedee })
                .then(function(two) {
                res.json(two);
            }).catch(function(err2) {
                console.log(err2);
            });
        } catch (e) {
            res.json(-1);
        }
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/serial/:serial', function(req, res) {
    Auto.findOne({ 'serial': req.params.serial })
        .then(function(one) {
        res.json(one);
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/serialexists/:serial', function(req, res) {
    Auto.countDocuments({ 'serial': req.params.serial }).then(function(count) {
        res.json(count);
    }).catch(function(err) {
        console.log(err);
    });
})

router.post('/', function(req, res){
    Location.findById(req.body.locationId).then(function(post5) {
        let itemType = post5.itemType;
        if (['Desktop','Aio','Laptop'].includes(itemType)) {
            let auto;
            switch(itemType) {
                case 'Desktop':
                    auto = Desktop;
                    break;
                case 'Aio':
                    auto = Aio;
                    break;
                case 'Laptop':
                    auto = Laptop;
                    break;
            }
            auto.create({fromId: req.body.fromId, locationId: req.body.locationId, identify: {idBarcode: req.body.idBarcode,
                    serial: req.body.serial, brand: req.body.brand, product: req.body.product,
                    version: req.body.version, notes: req.body.notes }, specifications: {processor: req.body.processor,
                    ramSize: req.body.ramSize, hardDrive: req.body.hardDrive}, manualInput: false})
                .then(function (post) {
                Job.findByIdAndUpdate(req.body.fromId, {$push: {itemList: post.id}}, {new: true})
                    .then(() => {
                    Location.findByIdAndUpdate(req.body.locationId, {$push: {itemList: post.id}}, {new: true})
                        .then(() => {
                        Processor.findOneAndUpdate({model: req.body.processor}, {model: req.body.processor},
                            {upsert: true, new: true, setDefaultsOnInsert: true})
                            .then(() => {
                                res.json({'success': true});
                            }).catch(function(err4) {
                            console.log(err4);
                        });
                    }).catch(function(err3) {
                        console.log(err3);
                    });
                }).catch(function(err2) {
                    console.log(err2);
                });
            }).catch(function(err2) {
                console.log(err2);
            });
        } else {
            console.log("Location Item Type Incorrect");
        }
    }).catch(function(err) {
        console.log(err);
    });

});

router.get('/from/:from', function(req, res) {
    Job.findById(req.params.from)
        .populate('itemList')
        .then(function(many) {
        res.json(many);
    }).catch(function(err) {
        console.log(err);
    });
});

module.exports = router;


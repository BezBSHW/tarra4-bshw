const Location = require("../model/Location.js");
const Item = require("../model/Item.js");
const Price = require("../model/Price/Processor");
const bwipjs = require('bwip-js');
const locationController = {};

locationController.list = function(req, res) {
    const user = req.user;
    if (req.user.locationR) {
        Location.find({})
            .sort({ locked: "asc", locate: "asc" })
            .limit(1000)
            .then(function (many) {
            res.render("../view/location/index", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationR");
        res.redirect("/");
    }
};

locationController.show = function(req, res) {
    const user = req.user;
    if (req.user.locationR) {
        Location.findById(req.params.id)
            .populate('itemList')
            .then(function (one) {
            Location.find({})
                .then(function(many) {
                res.render("../view/location/show", {one, many, user});
            }).catch(function(err2) {
                console.log(err2);
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationR");
        res.redirect("/");
    }
};
locationController.print = function(req, res) {
    const user = req.user;
    if (req.user.locationR) {
        Location.findById(req.params.id)
            .populate('itemList')
            .then(function (one) {
            Price.find({processorFamily: {$ne: null}})
                .then(function(processors) {
                var totalPrice = 0;
                for (var items = 0; items<one.itemList.length; items++) {
                    for (var procs = 0; procs<processors.length; procs++) {
                        if (one.itemList[items].specifications.processor==processors[procs].model) {
                            switch (one.itemList[items].itemType) {
                                case 'Aio':
                                    if (one.itemList[items].identify.brand.contains('Apple')) {
                                        one.itemList[items].price = parseFloat(processors[procs].processorFamily.imac.sellPrice);
                                    } else {
                                        one.itemList[items].price = parseFloat(processors[procs].processorFamily.aio.sellPrice);
                                    }
                                    break;
                                case 'Desktop':
                                    one.itemList[items].price = parseFloat(processors[procs].processorFamily.desktop.sellPrice);
                                    break;
                                case 'Laptop':
                                    if (one.itemList[items].identify.brand.contains('Apple')) {
                                        one.itemList[items].price = parseFloat(processors[procs].processorFamily.macbook.sellPrice);
                                    } else {
                                        one.itemList[items].price = parseFloat(processors[procs].processorFamily.laptop.sellPrice);
                                    }
                                    break;
                            }
                        }
                    }
                    totalPrice += parseFloat(one.itemList[items].price);
                }
                res.render("../view/location/print", {one, user, totalPrice});
            }).catch(function(err2) {
                console.log(err2);
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationR");
        res.redirect("/");
    }
};

locationController.edit = function(req, res) {
    const user = req.user;
    if (req.user.locationE) {
        Location.findOne({_id: req.params.id})
            .populate('itemList')
            .then(function (one) {
            res.render("../view/location/edit", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationE");
        res.redirect("/");
    }
};

locationController.create = function(req, res) {
    if (req.user.locationC) {
        const user = req.user;
        res.render("../view/location/create", {user});
    } else {
        console.log(req.user.username, "permission denied: locationC");
        res.redirect("/");
    }
}

locationController.save = function(req, res) {
    if (req.user.locationC) {
        const location = new Location(req.body);
        location.save().then(() => {
            console.log("Successfully created location.");
            res.redirect("/location/show/" + location._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationC");
        res.redirect("/");
    }
}

locationController.locate = function(req, res) {
    if (req.user.locationR) {
        Location.findOne({locate: req.params.location})
            .then(function (one) {
            res.redirect("/location/show/" + one._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationR");
        res.redirect("/");
    }
};

locationController.update = function(req, res) {
    const user = req.user;
    if (req.user.locationE) {
        Location.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(function (one) {
            res.redirect("/location/show/" + one._id);
        }).catch(function(err) {
            res.render("../view/location/edit", {one: req.body, user});
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: locationE");
        res.redirect("/");
    }
};

locationController.move = function(req, res) {
    if (req.user.locationE) {
        let checkboxes2 = [].concat(req.body.moveitem || []);
        for (let i = 0; i < checkboxes2.length; i++) {
            Item.findById(checkboxes2[i])
                .then(function (one) {
                Location.findByIdAndUpdate(one.locationId, {$pull: {itemList: checkboxes2[i]}}, {safe: true, multi: true})
                    .then(() => {
                    Location.findByIdAndUpdate(req.body.movement, {$push: {itemList: checkboxes2[i]}}, {new: true})
                        .then(function (three) {
                        Item.findByIdAndUpdate(checkboxes2[i], {$set: { locationId: three._id }}, {new: true})
                            .then(() => {
                            console.log(checkboxes2[i] + ' moved to ' + req.body.movement);
                        }).catch(function(err4) {
                            console.log(err4);
                        });
                    }).catch(function(err3) {
                        console.log(err3);
                    });
                }).catch(function(err2) {
                    console.log(err2);
                });
            }).catch(function(err) {
                console.log(err);
            });
        }
        res.redirect('/location/show/'+req.body.movement);
    } else {
        console.log(req.user.username, "permission denied: locationE");
        res.redirect("/");
    }
};

locationController.lock = function (req, res) {
    if (req.user.locationE) {
        Location.findByIdAndUpdate(req.params.id, { $set: {locked: true}}, { new: true})
            .then(function (one) {
            res.redirect("/location/show/"+one._id);
        }).catch(function(err) {
            console.log(err);
        });
    }
}

locationController.unlock = function (req, res) {
    if (req.user.locationE) {
        Location.findByIdAndUpdate(req.params.id, { $set: {locked: false}}, { new: true}).then(function (one) {
            res.redirect("/location/show/"+one._id);
        }).catch(function(err) {
            console.log(err);
        });
    }
}

locationController.bwip = function (req, res) {
    bwipjs.toBuffer({
        bcid: 'code128',
        text: req.params.id,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: 'center',
        alttext: req.params.locate
    }, function (err, png) {
        if(err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.setHeader('content-type', 'image/png');
            res.send(png);
        }
    });
}

locationController.bwipqr = function (req, res) {
    bwipjs.toBuffer({
        bcid: 'qrcode',
        text: req.params.id,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: 'center',
        alttext: req.params.locate
    }, function (err, png) {
        if(err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.setHeader('content-type', 'image/png');
            res.send(png);
        }
    });
}

locationController.bwipimg = function (req, res) {
    bwipjs.toBuffer({
        bcid: 'code128',
        text: req.params.id,
        scale: 2,
        height: 10
    }, function (err, png) {
        if(err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.setHeader('content-type', 'image/png');
            res.send(png);
        }
    });
}

locationController.bwipqrimg = function (req, res) {
    bwipjs.toBuffer({
        bcid: 'qrcode',
        text: req.params.id,
        scale: 2,
        height: 10
    }, function (err, png) {
        if(err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.setHeader('content-type', 'image/png');
            res.send(png);
        }
    });
}

module.exports = locationController;
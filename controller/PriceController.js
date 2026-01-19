const Processor = require("../model/Price/Processor.js");
const Family = require("../model/Price/ProcessorFamily.js");
const Monitor = require("../model/Price/Monitor.js");
const ModelOverride = require("../model/Price/ModelOverride.js");
const priceController = {};

priceController.index = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        res.render("../view/price/index", {user});
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.monitorList = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Monitor.find({})
            .sort({size:"asc"})
            .then(function (monitor) {
            res.render("../view/price/monitorIndex", {monitor, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuList = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Processor.find({
            $or: [
                { processorFamily: null },
                { processorFamily: { $exists: false } }
            ]})
            .sort({model:"desc"})
            .then(function (processor) {
            Family.find({})
                .sort({processorFamilyName:"asc"})
                .then(function (family) {
                res.render("../view/price/cpuIndex", {processor, family, user});
            }).catch(function(err2) {
                console.log(err2);
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

priceController.modelList = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        ModelOverride.find({})
            .sort({model:"asc"})
            .then(function (many) {
            res.render("../view/price/modelIndex", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
    }
}

priceController.cpuFamily = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Family.find({})
            .sort({processorFamilyName:"asc"})
            .then(function (family) {
            res.render("../view/price/cpuFamily", {family,user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuMassEdit = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Family.find({})
            .sort({processorFamilyName:"asc"})
            .then(function (family) {
                res.render("../view/price/cpuMassEdit", {family,user});
            }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuMassUpdate = function(req, res) {
    if (req.user.admin) {
        for (let i = 0; i < req.body.famdee.length; i++) {
            Family.findByIdAndUpdate(req.body.famdee[i],
                { $set:
                        { 'desktop.buyPrice': req.body.desktopBuyPrice[i],
                        'desktop.sellPrice': req.body.desktopSellPrice[i],
                            'laptop.buyPrice': req.body.laptopBuyPrice[i],
                            'laptop.sellPrice': req.body.laptopSellPrice[i],
                            'aio.buyPrice': req.body.aioBuyPrice[i],
                            'aio.sellPrice': req.body.aioSellPrice[i],
                            'imac.buyPrice': req.body.imacBuyPrice[i],
                            'imac.sellPrice': req.body.imacSellPrice[i],
                            'macbook.buyPrice': req.body.macbookBuyPrice[i],
                            'macbook.sellPrice': req.body.macbookSellPrice[i] },
            }, {new: true}).then(function(one) {
                console.log(one.processorFamilyName + ' updated');
            }).catch(function(err) {
                console.log(err);
            });
        }
        res.redirect('/price/cpu/family');
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.monitorShow = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Monitor.findById(req.params.id)
            .then(function (one) {
            res.render("../view/price/monitorShow", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuShow = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Family.findById(req.params.id)
            .populate({path: 'processor', options: { sort: { 'model': 1 }}})
            .then(function (one) {
            res.render("../view/price/cpuShow", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.modelShow = function (req,res) {
    const user = req.user;
    if (req.user.admin) {
        ModelOverride.findById(req.params.id)
            .then(function (one) {
            res.render("../view/price/modelShow", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
    }
}

priceController.cpuEdit = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Family.findById(req.params.id)
            .then(function (one) {
            res.render("../view/price/cpuEdit", {one,user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.monitorEdit = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Monitor.findById(req.params.id)
            .then(function (one) {
            res.render("../view/price/monitorEdit", {one,user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.modelEdit = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        ModelOverride.findById(req.params.id)
            .then(function (one) {
            res.render("../view/price/modelEdit", {one,user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
    }
}

priceController.monitorUpdate = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Monitor.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(function (one) {
            res.redirect("/price/monitor/show/" + one._id);
        }).catch(function(err) {
            res.render("../view/price/monitorEdit", {one: req.body, user});
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuUpdate = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        Family.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(function (one) {
            res.redirect("/price/cpu/show/" + one._id);
        }).catch(function(err) {
            res.render("../view/price/cpuEdit", {one: req.body, user});
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.modelUpdate = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        ModelOverride.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(function (one) {
            res.redirect("/price/model/show/" + one._id);
        }).catch(function(err) {
            res.render("../view/price/modelEdit", {one: req.body, user});
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
    }
}

priceController.monitorCreate = function(req, res) {
    if (req.user.admin) {
        const user = req.user;
        res.render("../view/price/monitorCreate", {user});
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuCreate = function(req, res) {
    if (req.user.admin) {
        const user = req.user;
        res.render("../view/price/cpuCreate", {user});
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.modelCreate = function(req, res) {
    if(req.user.admin) {
        const user = req.user;
        const modelName = '';
        res.render("../view/price/modelCreate", {user, modelName});
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.modelInsert = function(req, res) {
    if(req.user.admin) {
        const user = req.user;
        const modelName = req.params.model;
        res.render("../view/price/modelCreate", {user, modelName});
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.monitorSave = function(req, res) {
    if (req.user.admin) {
        const monitor = new Monitor(req.body);
        monitor.save().then(() => {
            console.log("Successfully created monitor pricing.");
            res.redirect("/price/monitor/show/" + monitor._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuSave = function(req, res) {
    if (req.user.admin) {
        const family = new Family(req.body);
        family.save().then(() => {
            console.log("Successfully created family.");
            res.redirect("/price/cpu/show/" + family._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.modelSave = function(req, res) {
    if (req.user.admin) {
        const modelOverride = new ModelOverride(req.body);
        modelOverride.save().then(() => {
            console.log("Successfully created ModelOverride.");
            res.redirect("/price/model/show/" + modelOverride._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuMove = function(req, res) {
    if (req.user.admin) {
        let checkboxes = [].concat(req.body.moveitem || []);
        for (let i = 0; i < checkboxes.length; i++) {
            Processor.findById(checkboxes[i]).then(() => {
                Family.findByIdAndUpdate(req.body.movement, {$push: {processor: checkboxes[i]}}, { new: true})
                    .then(() => {
                    Processor.findByIdAndUpdate(checkboxes[i], {$set: { processorFamily: req.body.movement}}, {new: true})
                        .then(() => {
                        console.log(checkboxes[i] + ' moved to ' + req.body.movement);
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
        res.redirect('/price/cpu');
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

priceController.cpuUnmove = function(req, res) {
    if (req.user.admin) {
        Family.findByIdAndUpdate(req.params.family, {$pull: {processor: req.params.cpu}}, {new: true}).then(() => {
            Processor.findByIdAndUpdate(req.params.cpu, {$set: { processorFamily: null}}, {new: true}).then(() => {
                res.redirect('/price/cpu/show/'+req.params.family);
            }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err2) {
            console.log(err2);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

module.exports = priceController;
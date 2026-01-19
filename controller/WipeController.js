const Wipe = require("../model/Wipe.js");
const Job = require("../model/Job.js");
const wipeController = {};

wipeController.list = function(req, res) {
    const user = req.user;
    if (req.user.wipeR) {
        Wipe.find({})
            .sort({created:"desc"})
            .limit(1000)
            .populate('fromId')
            .then(function (many) {
            res.render("../view/wipe/index", {many, user});
        }).catch(function(err) {
            console.log(err);
        })
    } else {
        console.log(req.user.username, "permission denied: wipeR");
        res.redirect("/");
    }
};

wipeController.show = function(req, res) {
    const user = req.user;
    if (req.user.wipeR) {
        Wipe.findOne({_id: req.params.id})
            .populate('fromId')
            .then(function (one) {
            res.render("../view/wipe/show", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeR");
        res.redirect("/");
    }
};

wipeController.from = function(req, res) {
    const user = req.user;
    if (req.user.wipeR) {
        Wipe.find({fromId: req.params.from})
            .populate('fromId')
            .then(function (many) {
            res.render("../view/wipe/index", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeR");
        res.redirect("/");
    }
};

wipeController.fromList = function(req, res) {
    const user = req.user;
    if (req.user.wipeR) {
        Wipe.distinct('fromId')
            .then(function (many) {
            res.render("../view/wipe/from", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeR");
        res.redirect("/");
    }
};

wipeController.update = function(req, res) {
    const user = req.user;
    if (req.user.wipeE) {
        Wipe.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .then(function (one) {
            res.redirect("/wipe/show/" + one._id);
        }).catch(function(err) {
            console.log(err);
            res.render("../view/wipe/edit", {one: req.body, user});
        });
    } else {
        console.log(req.user.username, "permission denied: wipeE");
        res.redirect("/");
    }
};

wipeController.edit = function(req, res) {
    const user = req.user;
    if (req.user.wipeE) {
        Wipe.findById( req.params.id )
            .populate('fromId')
            .then(function (one) {
            if(!one.fromId.completed) {
                res.render("../view/wipe/edit", {one, user});
            } else {
                console.log(one.fromId._id.toString(), "is locked");
                res.redirect("/wipe/show/"+one._id);
            }
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeE");
        res.redirect("/");
    }
};

wipeController.save = function(req, res) {
    if (req.user.wipeC) {
        Job.findById( req.body.fromId )
            .then(function(one) {
            req.body.started = true;
            req.body.startedDate = Date.now();
            const wipe = new Wipe(req.body);
            wipe.save().then(() => {
                Job.findByIdAndUpdate(req.body.fromId, {$push: {wipeList: wipe.id}}, {new: true})
                    .then(function (post) {
                    console.log("Successfully created wipe.");
                    res.redirect("/wipe/clone/" + wipe._id);
                }).catch(function(err3) {
                    console.log(err3);
                });
            }).catch(function(err2) {
                console.log(err2);
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeC");
        res.redirect("/");
    }
}

wipeController.create = function(req, res) {
    const user = req.user;
    if (req.user.wipeR) {
        Job.find({})
            .then(function(jobs) {
            res.render("../view/wipe/create", {user, jobs: jobs});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeC");
        res.redirect("/");
    }
}

wipeController.clone = function(req, res) {
    const user = req.user;
    if (req.user.wipeC) {
        Wipe.findOne({_id: req.params.id})
            .populate('fromId')
            .then(function (one) {
            if(!one.fromId.completed) {
                res.render("../view/wipe/clone", {one, user});
            } else {
                console.log(one.fromId._id, "locked");
                res.redirect("/wipe/show/"+one._id);
            }
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeC");
        res.redirect("/");
    }
}

wipeController.complete = function(req, res) {
    if (req.user.wipeE) {
        Wipe.findByIdAndUpdate(req.params.id, { $set: { finished: true, finishedDate: Date.now(), faulty: false }})
            .then(function(one) {
            res.redirect("/wipe/show/" + one._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeE");
        res.redirect("/");
    }
}

wipeController.faulty = function (req, res) {
    if (req.user.wipeE) {
        Wipe.findByIdAndUpdate(req.params.id, { $set: { faulty: true, faultyDate: Date.now(), finished: false }})
            .then(function(one) {
            res.redirect("/wipe/show/" + one._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeE");
        res.redirect("/");
    }
}

wipeController.fail = function (req, res) {
    if (req.user.wipeE) {
        Wipe.findByIdAndUpdate(req.params.id, { $set: { faulty: true, faultyDate: Date.now(), finished: false }})
            .then(function(one) {
            res.redirect("/wipe/status");
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeE");
        res.redirect("/");
    }
}

wipeController.status = function (req, res) {
    const user = req.user;
    if (req.user.wipeS) {
        Wipe.find({ $and: [{finished: false}, {faulty: false}] })
            .populate('fromId')
            .then(function (many) {
            res.render("../view/wipe/index", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: wipeS");
        res.redirect("/");
    }
}

module.exports = wipeController;

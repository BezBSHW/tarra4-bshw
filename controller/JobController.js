const Job = require('../model/Job.js');
const Item = require('../model/Item.js');
const Wipe = require('../model/Wipe.js');
const bwipjs = require("bwip-js");
const jobController = {};

jobController.list = function(req, res) {
    const user = req.user;
    if (req.user.jobR) {
        Job.find({})
            .sort({ completed: "asc", created: "desc" })
            .then(function(many) {
            res.render('../view/job/index', {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobR");
        res.redirect("/");
    }
};

jobController.asset = function(req, res) {
    const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector','Smartphone',
        'Storage','Tablet'];
    const user = req.user;
    if (req.user.jobR) {
        Job.findOne({_id: req.params.id})
            .populate('wipeList')
            .populate({path: 'itemList', options: { sort: { 'itemType': 1 } }})
            .then(function (one) {
            res.render("../view/job/show", {one, user, enumList});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobR");
        res.redirect("/");
    }
};

jobController.data = function(req, res) {
    const user = req.user;
    if (req.user.jobR) {
        Job.findOne({_id: req.params.id})
            .populate({ path: 'wipeList', populate: { path: 'itemId'}})
            .then(function (one) {
            res.render("../view/job/data", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobR");
        res.redirect("/");
    }
};

jobController.create = function(req, res) {
    if (req.user.jobC) {
        const user = req.user;
        res.render("../view/job/create", {user});
    } else {
        console.log(req.user.username, "permission denied: jobC");
        res.redirect("/");
    }
};

jobController.save = function(req, res) {
    const user = req.user;
    if (req.user.jobC) {
        const job = new Job(req.body);
        job.save().then(() => {
            console.log("Successfully created job.");
            res.redirect("/job/asset/"+job._id);
        }).catch(function(err) {
            res.render("../view/job/create", {user});
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobC");
        res.redirect("/");
    }
};

jobController.edit = function(req, res) {
    const user = req.user;
    if (req.user.jobE) {
        Job.findOne({_id: req.params.id})
            .then(function (one) {
            res.render("../view/job/edit", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobE");
        res.redirect("/");
    }
};

jobController.lock = function(req, res) {
    if (req.user.jobE) {
        Job.findByIdAndUpdate(req.params.id, { $set: { completed: true, completionDate: Date.now() }})
            .then(function(one) {
            res.redirect("/job/asset/" + one._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobE");
        res.redirect("/");
    }
}

jobController.datalock = function(req, res) {
    if (req.user.jobE) {
        Job.findByIdAndUpdate(req.params.id, { $set: { completed: true, completionDate: Date.now() }})
            .then(function(one) {
                res.redirect("/job/data/" + one._id);
            }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobE");
        res.redirect("/");
    }
}

jobController.unlock = function(req, res) {
    if (req.user.jobE) {
        Job.findByIdAndUpdate(req.params.id, { $set: { completed: false }})
            .then(function(one) {
            res.redirect("/job/asset/" + one._id);
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobE");
        res.redirect("/");
    }
}

jobController.dataunlock = function(req, res) {
    if (req.user.jobE) {
        Job.findByIdAndUpdate(req.params.id, { $set: { completed: false }})
            .then(function(one) {
                res.redirect("/job/data/" + one._id);
            }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobE");
        res.redirect("/");
    }
}

jobController.update = function(req, res) {
    const user = req.user;
    if (req.user.jobE) {
        Job.findByIdAndUpdate(req.params.id, { $set: { fromBarcode: req.body.fromBarcode,
                businessName: req.body.businessName, businessAddress: req.body.businessAddress,
            contactName: req.body.contactName, contactPhoneNumber: req.body.contactPhoneNumber,
            contactEmailAddress: req.body.contactEmailAddress, notes: req.body.notes,
                wipeReq: req.body.wipeReq, collectionDate: req.body.collectionDate}}, { new: true })
            .then(function (one) {
            res.redirect("/job/asset/" + one._id);
        }).catch(function(err) {
            res.render("../view/job/edit", {one: req.body, user});
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobE");
        res.redirect("/");
    }
};

jobController.status = function (req, res) {
    const user = req.user;
    let currentDate = new Date;
    currentDate.setTime(currentDate.getTime()-14*(24*60*60*1000));
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    if (req.user.jobS) {
        Item.aggregate([{ $match: { created: { $gte: currentDate }}},
            { $group: { _id: { "year": { "$year": "$created" },
                        "month": { "$month": "$created" },
                        "day": { "$dayOfMonth": "$created" }}, count:{ $sum: 1 }}},
            { $sort: { _id: -1 }}])
            .then(function(data1){
            Wipe.aggregate([{ $match: { created: { $gte: currentDate }}},
                { $group: { _id: { "year":  { "$year": "$created" },
                            "month": { "$month": "$created" },
                            "day":   { "$dayOfMonth": "$created" }}, count:{ $sum: 1 }}},
                { $sort: { _id: -1 }}])
                .then(function(data2){
                res.render("../view/job/status", {data1, data2, user});
            }).catch(function(err2) {
                console.log(err2);
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: jobS");
        res.redirect("/");
    }
}

jobController.bwip = function (req, res) {
    bwipjs.toBuffer({
        bcid: 'code128',
        text: req.params.id,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: 'center',
        alttext: req.params.from
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

jobController.bwipqr = function (req, res) {
    bwipjs.toBuffer({
        bcid: 'qrcode',
        text: req.params.id,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: 'center',
        alttext: req.params.from
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

jobController.bwipimg = function (req, res) {
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

jobController.bwipqrimg = function (req, res) {
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

module.exports = jobController;

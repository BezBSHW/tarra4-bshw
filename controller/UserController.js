const User = require("../model/User.js");
const Job = require("../model/Job.js");
const userController = {};

userController.list = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        User.find({})
            .then(function (many) {
            res.render("../view/user/index", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.show = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        User.findOne({_id: req.params.id})
            .then(function (one) {
            res.render("../view/user/show", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.create = function(req, res) {
    if (req.user.admin) {
        const user = req.user;
        res.render("../view/user/create", {user});
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.save = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        const newUser = new User(req.body);
        newUser.save().then(() => {
            console.log("Successfully created user.");
            res.redirect("/user/show/"+newUser._id);
        }).catch(function(err) {
            console.log(err);
            res.render("../view/user/create", {user});
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.edit = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        User.findOne({_id: req.params.id})
            .then(function (one) {
            res.render("../view/user/edit", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.pass = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        User.findOne({_id: req.params.id})
            .then(function (one) {
            res.render("../view/user/pass", {one, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.password = function(req, res) {
    if (req.user.admin) {
        if (req.body.passone===req.body.passtwo) {
            User.findById(req.params.id)
                .then((userAcc) => {
                userAcc.setPassword(req.body.passone, (err, userAcc) => {
                    if (err) {
                        console.log(err);
                    }
                    userAcc.save();
                    res.redirect("/user/edit/"+req.params.id);
                })
            });
        }
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

userController.update = function(req, res) {
    const user = req.user;
    if (req.user.admin) {
        User.findByIdAndUpdate(req.params.id, { $set: req.body}, { new: true })
            .then(function (one) {
            res.redirect("/user/show/" + one._id);
        }).catch(function(err) {
            console.log(err);
            res.render("../view/user/edit", {one: req.body, user});
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
};

module.exports = userController;
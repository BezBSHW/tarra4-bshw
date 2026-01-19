const Item = require("../model/Item.js");
const Wipe = require("../model/Wipe.js");
const adminController = {};

adminController.index = function(req, res) {
    if(req.user.admin) {
        const user = req.user;
        res.render("../view/admin/index", {user});

    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

module.exports = adminController;
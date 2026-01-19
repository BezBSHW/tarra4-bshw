const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const admin = require("../controller/AdminController");

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => admin.index(req, res));

module.exports = router;
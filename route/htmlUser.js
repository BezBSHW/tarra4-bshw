const express = require('express');
const router = express.Router();
const user = require("../controller/UserController.js");
const connectEnsureLogin = require('connect-ensure-login');
const job = require("../controller/JobController.js");

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.list(req, res));

router.get('/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.show(req, res));

router.get('/create', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.create(req, res));

router.post('/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.save(req, res));

router.get('/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.edit(req, res));

router.get('/pass/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.pass(req, res));

router.post('/password/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.password(req, res));

router.post('/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.update(req, res));

router.get('/delete/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => user.delete(req, res));

module.exports = router;
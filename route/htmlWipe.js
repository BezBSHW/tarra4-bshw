const express = require('express');
const router = express.Router();
const wipe = require("../controller/WipeController.js");
const connectEnsureLogin = require('connect-ensure-login');

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.list(req, res));

router.get('/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.show(req, res));

router.get('/from/:from', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.from(req, res));

router.get('/from/', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.fromList(req, res));

router.get('/create/', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.create(req, res));

router.post('/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.save(req, res));

router.get('/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.edit(req, res));

router.post('/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.update(req, res));

router.get('/clone/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.clone(req, res));

router.get('/complete/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.complete(req, res));

router.get('/faulty/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.faulty(req, res));

router.get('/fail/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.fail(req, res));

router.get('/status', connectEnsureLogin.ensureLoggedIn(), (req, res) => wipe.status(req, res));

module.exports = router;

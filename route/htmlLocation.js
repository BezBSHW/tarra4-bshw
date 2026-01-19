const express = require('express');
const router = express.Router();
const location = require("../controller/LocationController.js");
const connectEnsureLogin = require('connect-ensure-login');

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.list(req, res));

router.get('/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.show(req, res));

router.get('/print/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.print(req, res));

router.get('/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.edit(req, res));

router.post('/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.update(req, res));

router.get('/create/', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.create(req, res));

router.post('/move/', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.move(req, res));

router.post('/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.save(req, res));

router.get('/locate/:location', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.locate(req, res));

router.get('/lock/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.lock(req, res));

router.get('/unlock/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.unlock(req, res));

router.get('/bwip/:id/:locate', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.bwip(req, res));

router.get('/bwipimg/:id/:locate', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.bwipimg(req, res));

router.get('/bwipqr/:id/:locate', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.bwipqr(req, res));

router.get('/bwipqrimg/:id/:locate', connectEnsureLogin.ensureLoggedIn(), (req, res) => location.bwipqrimg(req, res));

module.exports = router;
const express = require('express');
const router = express.Router();
const job = require("../controller/JobController.js");
const connectEnsureLogin = require('connect-ensure-login');
const {connect} = require("mongoose");

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.list(req, res));

router.get('/asset/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.asset(req, res));

router.get('/data/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.data(req, res));

router.get('/create', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.create(req, res));

router.post('/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.save(req, res));

router.get('/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.edit(req, res));

router.get('/lock/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.lock(req, res));

router.get('/unlock/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.unlock(req, res));

router.get('/datalock/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.datalock(req, res));

router.get('/dataunlock/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.dataunlock(req, res));

router.post('/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.update(req, res));

router.get('/status', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.status(req, res));

router.get('/bwip/:id/:from', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.bwip(req, res));

router.get('/bwipimg/:id/:from', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.bwipimg(req, res));

router.get('/bwipqr/:id/:from', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.bwipqr(req, res));

router.get('/bwipqrimg/:id/:from', connectEnsureLogin.ensureLoggedIn(), (req, res) => job.bwipqrimg(req, res));

module.exports = router;

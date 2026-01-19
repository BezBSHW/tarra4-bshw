const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const report = require("../controller/ReportController");

router.post('/find/', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.find(req, res));

router.get('/find/', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.finditems(req, res));

router.get('/find/:findme', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.finditems(req, res));

router.get('/sustain/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.sustain(req, res));

router.get('/data/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.data(req, res));

router.get('/location/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.location(req, res));

router.get('/statistics', connectEnsureLogin.ensureLoggedIn(), (req, res) => report.statistics(req, res));

module.exports = router;
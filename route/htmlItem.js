const express = require('express');
const router = express.Router();
const item = require("../controller/ItemController.js");
const connectEnsureLogin = require('connect-ensure-login');
const {connect} = require("mongoose");

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.list(req, res));

router.get('/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.show(req, res));

router.get('/idBarcode/', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.list(req, res));

router.get('/fromBarcode/:from', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.from(req, res));

router.get('/fromBarcode/', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.fromlist(req, res));

router.get('/locationBarcode/', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.locationlist(req, res));

router.get('/locationBarcode/:location', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.location(req, res));

router.get('/type/', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.typelist(req, res));

router.get('/type/:type', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.type(req, res));

router.get('/create', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.create(req, res));

router.get('/create/:type', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.createItem(req, res));

router.get('/create/:type/:job', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.createJobItem(req, res));

router.post('/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.save(req, res));

router.get('/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.edit(req, res));

router.get('/clone/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.clone(req, res));

router.post('/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.update(req, res));

router.get('/import/:type/:job', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.importJobItem(req, res));

router.post('/import', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.import(req, res));

router.get('/repeat/:previous', connectEnsureLogin.ensureLoggedIn(), (req, res) => item.importJobItemRepeat(req, res));

module.exports = router;
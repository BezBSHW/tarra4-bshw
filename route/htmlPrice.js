const express = require('express');
const router = express.Router();
const price = require("../controller/PriceController.js");
const connectEnsureLogin = require('connect-ensure-login');
const {connect} = require("mongoose");

router.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.index(req, res));

router.get('/monitor', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.monitorList(req, res));

router.get('/model', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelList(req, res));

router.get('/model/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelShow(req, res));

router.get('/model/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelEdit(req, res));

router.post('/model/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelUpdate(req, res));

router.get('/model/create', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelCreate(req, res));

router.get('/model/insert/:model', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelInsert(req, res));

router.post('/model/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.modelSave(req, res));

router.get('/monitor/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.monitorShow(req, res));

router.get('/monitor/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.monitorEdit(req, res));

router.post('/monitor/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.monitorUpdate(req, res));

router.get('/monitor/create', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.monitorCreate(req, res));

router.post('/monitor/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.monitorSave(req, res));

router.get('/cpu', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuList(req, res));

router.get('/cpu/family', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuFamily(req, res));

router.get('/cpu/mass', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuMassEdit(req, res));

router.post('/cpu/massUpdate', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuMassUpdate(req, res));

router.get('/cpu/show/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuShow(req, res));

router.get('/cpu/edit/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuEdit(req, res));

router.post('/cpu/update/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuUpdate(req, res));

router.get('/cpu/create', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuCreate(req, res));

router.post('/cpu/save', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuSave(req, res));

router.post('/cpu/move', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuMove(req, res));

router.get('/cpu/unmove/:family/:cpu', connectEnsureLogin.ensureLoggedIn(), (req, res) => price.cpuUnmove(req, res));



module.exports = router;
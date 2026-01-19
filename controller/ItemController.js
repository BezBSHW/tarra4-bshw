const Item = require("../model/Item.js");
const Aio = require('../model/Item/Aio.js');
const Desktop = require('../model/Item/Desktop.js');
const Laptop = require('../model/Item/Laptop.js');
const Monitor = require('../model/Item/Monitor.js');
const Network = require('../model/Item/Network.js');
const Phone = require('../model/Item/Phone.js');
const Printer = require('../model/Item/Printer.js');
const Projector = require('../model/Item/Projector.js');
const Smartphone = require('../model/Item/Smartphone.js');
const Storage = require('../model/Item/Storage.js');
const Tablet = require('../model/Item/Tablet.js');
const Job = require("../model/Job.js");
const Location = require("../model/Location.js");
const axios = require('axios');
const Wipe = require("../model/Wipe");

const itemController = {};

itemController.list = function(req, res) {
    const user = req.user;
    if (req.user.itemR) {
        Item.find({})
            .sort({created:"desc"})
            .limit(1000)
            .populate('fromId')
            .populate('locationId')
            .then(function (many) {
            res.render("../view/item/index", {many, user});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: itemR");
        res.redirect("/");
    }
};

itemController.show = function(req, res) {
    const user = req.user;
    if (req.user.itemR) {
        Item.findById(req.params.id)
            .populate('fromId')
            .populate('locationId')
            .then(function (one) {
            let enums = false;
            if (['Network','Printer','Projector'].includes(one.itemType)) {
                enums = true;
            }
            res.render("../view/item/show", {one, user, enums});
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: itemR");
        res.redirect("/");
    }
};

itemController.create = function(req, res) {
    if (req.user.itemC) {
        const user = req.user;
        const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector','Smartphone',
            'Storage','Tablet'];
        res.render("../view/item/create", {enumList, user});
    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
};

itemController.createItem = function(req, res) {
    if (req.user.itemC) {
        const user = req.user;
        const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector','Smartphone',
            'Storage','Tablet'];
        let fullSchema;
        let enumsList;
        let enums = false;
        let itemCat;
        if (enumList.includes(req.params.type.toString())) {
            const itemType = req.params.type.toString();
            switch (itemType) {
                case 'Aio':
                    fullSchema = Aio.schema;
                    itemCat = 'Aio';
                    break;
                case 'Desktop':
                    fullSchema = Desktop.schema;
                    itemCat = 'Desktop';
                    break;
                case 'Laptop':
                    fullSchema = Laptop.schema;
                    itemCat = 'Laptop';
                    break;
                case 'Monitor':
                    fullSchema = Monitor.schema;
                    itemCat = 'Misc';
                    break;
                case 'Network':
                    fullSchema = Network.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Phone':
                    fullSchema = Phone.schema;
                    itemCat = 'Misc';
                    break;
                case 'Printer':
                    fullSchema = Printer.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Projector':
                    fullSchema = Projector.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Smartphone':
                    fullSchema = Smartphone.schema;
                    itemCat = 'Misc';
                    break;
                case 'Storage':
                    fullSchema = Storage.schema;
                    itemCat = 'Misc';
                    break;
                case 'Tablet':
                    fullSchema = Tablet.schema;
                    itemCat = 'Misc';
                    break;
            }
            const identList = fullSchema.pick(['identify']);
            const specList = fullSchema.pick(['specifications']);
            const faultList = fullSchema.pick(['faults']);
            const globalFaults = fullSchema.pick(['globalFaults']);
            Job.find({})
                .then(function(jobs) {
                Location.find({ itemType: itemCat })
                    .then(function(locations){
                    res.render("../view/item/createItem", {itemType, identList, specList, enumsList, faultList,
                        globalFaults, fullSchema, user, jobs: jobs, locations: locations, enums});
                }).catch(function(err2) {
                    console.log(err2);
                });
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            console.log("itemType: ", req.params.type.toString(), " not found");
            res.redirect("/");
        }
    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
};

itemController.createJobItem = function(req, res) {
    if (req.user.itemC) {
        const user = req.user;
        const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector','Smartphone',
            'Storage','Tablet'];
        let fullSchema;
        let enumsList;
        let enums = false;
        let itemCat;
        if (enumList.includes(req.params.type.toString())) {
            const itemType = req.params.type.toString();
            switch (itemType) {
                case 'Aio':
                    fullSchema = Aio.schema;
                    itemCat = 'Aio';
                    break;
                case 'Desktop':
                    fullSchema = Desktop.schema;
                    itemCat = 'Desktop';
                    break;
                case 'Laptop':
                    fullSchema = Laptop.schema;
                    itemCat = 'Laptop';
                    break;
                case 'Monitor':
                    fullSchema = Monitor.schema;
                    itemCat = 'Misc';
                    break;
                case 'Network':
                    fullSchema = Network.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Phone':
                    fullSchema = Phone.schema;
                    itemCat = 'Misc';
                    break;
                case 'Printer':
                    fullSchema = Printer.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Projector':
                    fullSchema = Projector.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Smartphone':
                    fullSchema = Smartphone.schema;
                    itemCat = 'Misc';
                    break;
                case 'Storage':
                    fullSchema = Storage.schema;
                    itemCat = 'Misc';
                    break;
                case 'Tablet':
                    fullSchema = Tablet.schema;
                    itemCat = 'Misc';
                    break;
            }
            const identList = fullSchema.pick(['identify']);
            const specList = fullSchema.pick(['specifications']);
            const faultList = fullSchema.pick(['faults']);
            const globalFaults = fullSchema.pick(['globalFaults']);
            Job.findById(req.params.job)
                .then(function(currentJob) {
                Location.find({itemType: itemCat})
                    .then(function(locations){
                    res.render("../view/item/createJobItem", {itemType, identList, specList, enumsList, faultList,
                            globalFaults, fullSchema, user, locations: locations, enums, currentJob});
                }).catch(function(err2) {
                    console.log(err2);
                });
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            console.log("itemType: ", req.params.type.toString(), " not found");
            res.redirect("/");
        }
    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
};

itemController.importJobItem = function(req, res) {
    if (req.user.itemC) {
        const user = req.user;
        const enumList = ['Aio','Desktop','Laptop'];
        if (enumList.includes(req.params.type.toString())) {
            const itemType = req.params.type.toString();
            let previousItem;
            Job.findById(req.params.job)
                .then(function(currentJob) {
                    Location.find({itemType: itemType})
                        .then(function(locations){
                            res.render("../view/item/importJobItem", {itemType,
                                user, locations: locations, currentJob, previousItem});
                        }).catch(function(err2) {
                        console.log(err2);
                    });
                }).catch(function(err) {
                console.log(err);
            });
        } else {
            console.log("itemType: ", req.params.type.toString(), " not found");
            res.redirect("/");
        }
    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
};

itemController.import = async function(req, res) {
    if (req.user.itemC) {
        const idBarcode = req.body.idBarcode;
        try {
            const bdeResponse = await axios.post('https://blanccoaddress/v1/report/export', {
                "filter": {
                    "date": {
                        "gte": "2020-01-01T00:00:00Z"
                    },
                    "fields": [
                        {
                            "name": "@custom-IDcode",
                            "like": idBarcode
                        }
                    ]
                },
                "container": "NONE",
                "format": "JSON",
                "cursor": ""
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-BLANCCO-API-KEY': 'add api key here'
                }
            })

            const responseBody = bdeResponse.data;
            if (
                Array.isArray(responseBody?.reports) &&
                responseBody.reports.length > 0 &&
                responseBody.reports[0]?.blancco_data?.blancco_hardware_report?.system !== undefined
            ) {
                const systemReport = responseBody.reports[0].blancco_data.blancco_hardware_report.system;
                let manufacturer = '';
                let model = '';
                let serial = '';
                for (let i = 0; i < systemReport.length; i++) {
                    if (typeof systemReport[i].manufacturer !== 'undefined') {
                        manufacturer = systemReport[i].manufacturer;
                    }
                    if (typeof systemReport[i].model !== 'undefined') {
                        model = systemReport[i].model;
                    }
                    if (typeof systemReport[i].serial !== 'undefined') {
                        serial = systemReport[i].serial;
                    }
                } // works
                const processorsReport = responseBody.reports[0].blancco_data.blancco_hardware_report.processors;
                let processorReport = '';
                let processorModel = '';
                for (let i = 0; i < processorsReport.length; i++) {
                    if (typeof processorsReport[i].processor !== 'undefined') {
                        processorReport = processorsReport[i].processor;
                        for (let ii = 0; ii < processorReport.length; ii++) {
                            if (typeof processorReport[ii].model !== 'undefined') {
                                processorModel = processorReport[ii].model;
                            }
                        }
                    }
                } // works
                const memoryReport = responseBody.reports[0].blancco_data.blancco_hardware_report.memory;
                let totalMemory = '';
                for (let i = 0; i < memoryReport.length; i++) {
                    if (typeof memoryReport[i].total_memory !== 'undefined') {
                        totalMemory = '' + (memoryReport[i].total_memory / (1024 * 1024));
                    }
                } // works
                const userData = responseBody.reports[0].user_data.fields;
                let idcode = '';
                let notes = '';
                for (let i = 0; i < userData.length; i++) {
                    if (typeof userData[i].IDcode !== 'undefined') {
                        idcode = userData[i].IDcode;
                    }
                    if (typeof userData[i].Notes !== 'undefined') {
                        notes = userData[i].Notes;
                    }
                } // works
                const disksReport = responseBody.reports[0].blancco_data.blancco_hardware_report.disks;
                let diskReport = '';
                let diskCapacity = '';
                for (let i = 0; i < disksReport.length; i++) {
                    if (typeof disksReport[i].disk !== 'undefined') {
                        diskReport = disksReport[i].disk;
                        for (let ii = 0; ii < diskReport.length; ii++) {
                            if (typeof diskReport[ii].capacity !== 'undefined') {
                                diskCapacity += '' + parseInt(diskReport[ii].capacity / (1000 * 1000 * 1000)) + ' GB ';
                            }
                        }
                    }
                } // works
                if (diskCapacity === '') {
                    diskCapacity = 'None';
                }

                const newItem = {
                    fromId: req.body.fromId,
                    locationId: req.body.locationId,
                    identify: {
                        idBarcode: idcode,
                        serial: serial,
                        brand: manufacturer,
                        product: model,
                        version: '',
                        notes: notes
                    },
                    specifications: {
                        processor: processorModel,
                        ramSize: totalMemory,
                        hardDrive: diskCapacity
                    },
                    manualInput: false
                };

                const erasuresReport = responseBody.reports[0].blancco_data.blancco_erasure_report.erasures;
                let erasureReport = '';
                let targetReport = '';
                let targetModel = '';
                let targetSerial = '';
                let targetCapacity = '';
                let diskState = false;
                let startDate = '';
                let endDate = '';
                let wipeData = [];

                for (let i = 0; i < erasuresReport.length; i++) {
                    if (typeof erasuresReport[i].erasure !== 'undefined') {
                        erasureReport = erasuresReport[i].erasure;
                        for (let ii = 0; ii < erasureReport.length; ii++) {
                            if (typeof erasureReport[ii].target !== 'undefined') {
                                targetReport = erasureReport[ii].target;
                                for (let iii = 0; iii < targetReport.length; iii++) {
                                    if (typeof targetReport[iii].model !== 'undefined') {
                                        targetModel = targetReport[iii].model;
                                    }
                                    if (typeof targetReport[iii].serial !== 'undefined') {
                                        targetSerial = targetReport[iii].serial;
                                    }
                                    if (typeof targetReport[iii].capacity !== 'undefined') {
                                        targetCapacity = '' + parseInt(targetReport[iii].capacity / (1000 * 1000 * 1000)) + ' GB';
                                    }
                                }
                            }
                            if (typeof erasureReport[ii].state !== 'undefined') {
                                if (erasureReport[ii].state == 'Successful') {
                                    diskState = true;
                                } else {
                                    diskState = false;
                                }
                            }
                            if (typeof erasureReport[ii].start_time !== 'undefined') {
                                startDate = new Date(erasureReport[ii].start_time);
                            }
                            if (typeof erasureReport[ii].end_time !== 'undefined') {
                                endDate = new Date(erasureReport[ii].end_time);
                            }
                        }
                        if (diskState) {
                            wipeData.push({
                                fromId: req.body.fromId,
                                itemId: '',
                                product: targetModel,
                                serial: targetSerial,
                                size: targetCapacity,
                                started: true,
                                startedDate: startDate,
                                finished: true,
                                finishedDate: endDate
                            })
                        } else {
                            wipeData.push({
                                fromId: req.body.fromId,
                                itemId: '',
                                product: targetModel,
                                serial: targetSerial,
                                size: targetCapacity,
                                started: true,
                                startedDate: startDate,
                            })
                        }
                    }
                }

                const enumList = ['Aio', 'Desktop', 'Laptop'];

                Job.findById(req.body.fromId)
                    .then(function (one) {
                        if (!one.completed) {
                            if (enumList.includes(req.body.itemType.toString())) {
                                const itemType = req.body.itemType.toString();
                                let item;
                                switch (itemType) {
                                    case 'Aio':
                                        item = new Aio(newItem);
                                        break;
                                    case 'Desktop':
                                        item = new Desktop(newItem);
                                        break;
                                    case 'Laptop':
                                        item = new Laptop(newItem);
                                        break;
                                }
                                item.save().then(() => {
                                    Job.findByIdAndUpdate(req.body.fromId, {$push: {itemList: item.id}}, {new: true})
                                        .then(() => {
                                            Location.findByIdAndUpdate(req.body.locationId, {$push: {itemList: item.id}}, {new: true})
                                                .then(() => {
                                                    for (let i = 0; i < wipeData.length; i++) {
                                                        wipeData[i].itemId = item.id;
                                                        Wipe.create(wipeData[i])
                                                            .then(function (post) {
                                                                Job.findByIdAndUpdate(req.body.fromId, {$push: {wipeList: post.id}}, {new: true})
                                                                    .then(function (post2) {
                                                                        console.log("Successfully created wipe.");
                                                                    }).catch(function (err2) {
                                                                    console.log(err2);
                                                                });
                                                            }).catch(function (err) {
                                                            console.log(err);
                                                        });
                                                    }
                                                    console.log("Successfully created item.");
                                                    res.redirect("/item/repeat/" + item._id);
                                                }).catch(function (err4) {
                                                console.log(err4);
                                            });
                                        }).catch(function (err3) {
                                        console.log(err3);
                                    });
                                }).catch(function (err2) {
                                    res.redirect("/item/create");
                                    console.log(err2);
                                });
                            }
                        } else {
                            console.log(one._id, "locked");
                        }
                    }).catch(function (err) {
                    console.log(err);
                });
            } else {
                console.log('Error fetching data:', idBarcode);
                res.redirect("/item/import/" + req.body.itemType.toString() + "/" + req.body.fromId);
                //<a href="/item/import/<%=enumList[enumHtml]%>/<%=one._id%>">Import</a>
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
}

itemController.importJobItemRepeat = function(req, res) {
    if (req.user.itemC) {
        const user = req.user;
        const enumList = ['Aio','Desktop','Laptop'];
        Item.findById(req.params.previous)
            .then(function (one) {
            const itemType = one.itemType;
            const previousItem = one;
            if (enumList.includes(itemType)) {
                Job.findById(one.fromId)
                    .then(function(currentJob) {
                    Location.find({itemType: itemType})
                        .then(function(locations){
                        res.render("../view/item/importJobItem", {itemType,
                            user, locations: locations, currentJob, previousItem});
                        }).catch(function(err2) {
                            console.log(err2);
                        });
                    }).catch(function(err) {
                        console.log(err);
                    });
                } else {
                    console.log("itemType: ", req.params.type.toString(), " not found");
                    res.redirect("/");
                }
        }).catch(function(err) {
            console.log(err);
        });

    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
};

itemController.save = function(req, res) {
    const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector',
        'Smartphone', 'Storage','Tablet'];
    if (req.user.itemC) {
        Job.findById(req.body.fromId)
            .then(function(one) {
            if (!one.completed) {
                if (enumList.includes(req.body.itemType.toString())) {
                    const itemType = req.body.itemType.toString();
                    let item;
                    for(var property in req.body) {
                        if (Array.isArray(req.body[property])) {
                            req.body[property] = true;
                        }
                    }
                    switch (itemType) {
                        case 'Aio':
                            item = new Aio(req.body);
                            break;
                        case 'Desktop':
                            item = new Desktop(req.body);
                            break;
                        case 'Laptop':
                            item = new Laptop(req.body);
                            break;
                        case 'Monitor':
                            item = new Monitor(req.body);
                            break;
                        case 'Network':
                            item = new Network(req.body);
                            break;
                        case 'Phone':
                            item = new Phone(req.body);
                            break;
                        case 'Printer':
                            item = new Printer(req.body);
                            break;
                        case 'Projector':
                            item = new Projector(req.body);
                            break;
                        case 'Smartphone':
                            item = new Smartphone(req.body);
                            break;
                        case 'Storage':
                            item = new Storage(req.body);
                            break;
                        case 'Tablet':
                            item = new Tablet(req.body);
                            break;
                    }
                    item.save().then(() => {
                        Job.findByIdAndUpdate(req.body.fromId, {$push: {itemList: item.id}}, {new: true})
                            .then(() => {
                            Location.findByIdAndUpdate(req.body.locationId, {$push: {itemList: item.id}}, {new: true})
                                .then(() => {
                                console.log("Successfully created item.");
                                res.redirect("/item/clone/" + item._id);
                            }).catch(function(err4) {
                                console.log(err4);
                            });
                        }).catch(function(err3) {
                            console.log(err3);
                        });
                    }).catch(function(err2) {
                        res.redirect("/item/create");
                        console.log(err2);
                    });
                }
            } else {
                console.log(one._id, "locked");
            }
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: itemC");
        res.redirect("/");
    }
}

itemController.edit = function(req, res) {
    const user = req.user;
    const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector','Smartphone',
        'Storage','Tablet'];
    if (req.user.itemE) {
        Item.findOne({_id: req.params.id})
            .populate('fromId')
            .populate('locationId')
            .then(function (one) {
            let fullSchema;
            let enumsList;
            let enums = false;
            if (enumList.includes(one.itemType)) {
                const itemType = one.itemType.toString();
                switch (itemType) {
                    case 'Aio':
                        fullSchema = Aio.schema;
                        break;
                    case 'Desktop':
                        fullSchema = Desktop.schema;
                        break;
                    case 'Laptop':
                        fullSchema = Laptop.schema;
                        break;
                    case 'Monitor':
                        fullSchema = Monitor.schema;
                        break;
                    case 'Network':
                        fullSchema = Network.schema;
                        enumsList = fullSchema.pick(['enumerators']);
                        enums = true;
                        break;
                    case 'Phone':
                        fullSchema = Phone.schema;
                        break;
                    case 'Printer':
                        fullSchema = Printer.schema;
                        enumsList = fullSchema.pick(['enumerators']);
                        enums = true;
                        break;
                    case 'Projector':
                        fullSchema = Projector.schema;
                        enumsList = fullSchema.pick(['enumerators']);
                        enums = true;
                        break;
                    case 'Smartphone':
                        fullSchema = Smartphone.schema;
                        break;
                    case 'Storage':
                        fullSchema = Storage.schema;
                        break;
                    case 'Tablet':
                        fullSchema = Tablet.schema;
                        break;
                }
                const identList = fullSchema.pick(['identify']);
                const specList = fullSchema.pick(['specifications']);
                const faultList = fullSchema.pick(['faults']);
                const globalFaults = fullSchema.pick(['globalFaults']);
                res.render("../view/item/edit", { one: one, itemType, identList, specList, enumsList, faultList,
                    globalFaults, fullSchema, user, enums });
            } else {
                console.log(itemType, " Not found");
                res.redirect("/");
            }
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, " permission denied: itemE");
        res.redirect("/");
    }
};

itemController.clone = function(req, res) {
    const user = req.user;
    const enumList = ['Aio', 'Desktop', 'Laptop', 'Monitor', 'Network', 'Phone', 'Printer', 'Projector', 'Smartphone',
        'Storage', 'Tablet'];
    if (req.user.itemC) {
        Item.findOne({_id: req.params.id}).populate('fromId').populate('locationId').then(function (one) {
            const itemType = one.itemType;
            const itemBody = one;
            let fullSchema;
            let enumsList;
            let enums = false;
            let itemCat;
            if (enumList.includes(itemType)) {
                switch (itemType) {
                case 'Aio':
                    fullSchema = Aio.schema;
                    itemCat = 'Aio';
                    break;
                case 'Desktop':
                    fullSchema = Desktop.schema;
                    itemCat = 'Desktop';
                    break;
                case 'Laptop':
                    fullSchema = Laptop.schema;
                    itemCat = 'Laptop';
                    break;
                case 'Monitor':
                    fullSchema = Monitor.schema;
                    itemCat = 'Misc';
                    break;
                case 'Network':
                    fullSchema = Network.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Phone':
                    fullSchema = Phone.schema;
                    itemCat = 'Misc';
                    break;
                case 'Printer':
                    fullSchema = Printer.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Projector':
                    fullSchema = Projector.schema;
                    itemCat = 'Misc';
                    enumsList = fullSchema.pick(['enumerators']);
                    enums = true;
                    break;
                case 'Smartphone':
                    fullSchema = Smartphone.schema;
                    itemCat = 'Misc';
                    break;
                case 'Storage':
                    fullSchema = Storage.schema;
                    itemCat = 'Misc';
                    break;
                case 'Tablet':
                    fullSchema = Tablet.schema;
                    itemCat = 'Misc';
                    break;
                }
                const identList = fullSchema.pick(['identify']);
                const specList = fullSchema.pick(['specifications']);
                const faultList = fullSchema.pick(['faults']);
                const globalFaults = fullSchema.pick(['globalFaults']);
                Job.find({})
                    .then(function (jobs) {
                    Location.find({itemType: itemCat})
                        .then(function (locations) {
                        res.render("../view/item/clone", {itemType, identList, specList, enumsList, faultList,
                                globalFaults, fullSchema, user, jobs: jobs, locations: locations, enums, one });
                    }).catch(function(err3) {
                        console.log(err3);
                    });
                }).catch(function(err2) {
                    console.log(err2);
                });
            } else {
                console.log("itemType: ", itemType, " not found");
                res.redirect("/");
            }
        }).catch(function(err) {
            console.log(err);
        });
    } else {
            console.log(req.user.username, "permission denied: itemC");
            res.redirect("/");
    }
};

itemController.update = function(req, res) {
    const enumList = ['Aio','Desktop','Laptop','Monitor','Network','Phone','Printer','Projector','Smartphone',
        'Storage','Tablet'];
    if (req.user.itemE) {
        let itemType = req.body.itemType;
        if (enumList.includes(itemType)) {
            let item;
            switch (itemType) {
                case 'Aio':
                    item = Aio;
                    break;
                case 'Desktop':
                    item = Desktop;
                    break;
                case 'Laptop':
                    item = Laptop;
                    break;
                case 'Monitor':
                    item = Monitor;
                    break;
                case 'Network':
                    item = Network;
                    break;
                case 'Phone':
                    item = Phone;
                    break;
                case 'Printer':
                    item = Printer;
                    break;
                case 'Projector':
                    item = Projector;
                    break;
                case 'Smartphone':
                    item = Smartphone;
                    break;
                case 'Storage':
                    item = Storage;
                    break;
                case 'Tablet':
                    item = Tablet;
                    break;
            }
            for(var property in req.body) {
                if (Array.isArray(req.body[property])) {
                    req.body[property] = true;
                }
            }
            item.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
                .then(function (one) {
                res.redirect("/item/show/" + one._id);
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            console.log(itemType, " not found");
            res.redirect("/");
        }
    } else {
        console.log(req.user.username, "permission denied: itemE");
        res.redirect("/");
    }
};

// need to make update

module.exports = itemController;

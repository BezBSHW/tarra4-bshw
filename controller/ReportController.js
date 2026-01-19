const Job = require('../model/Job.js');
const Cpu = require('../model/Price/Processor.js');
const Monitor = require('../model/Price/Monitor.js');
const ModelOverride = require('../model/Price/ModelOverride.js');
const Location = require('../model/Location.js');
const Item = require('../model/Item.js');
const Wipe = require('../model/Wipe.js');
const Excel = require('exceljs');
const {query} = require("express");
const connectEnsureLogin = require("connect-ensure-login");
const reportController = {};

reportController.find = function (req, res) {
    res.redirect("/report/find/"+req.body.finditem);
}

reportController.finditems = function (req, res) {
    const user = req.user;

    if(req.user.admin) {
        if(typeof req.params.findme=='undefined') {
            let many = '';
            let search = '';
            res.render("../view/report/find", { many, user, search });
        } else {
            if(req.params.findme.length>3) {
                Item.find({ "$or": [
                    { "identify.idBarcode": { '$regex': req.params.findme, '$options': 'i' }},
                        { "identify.serial": { '$regex': req.params.findme, '$options': 'i' }},
                        { "identify.brand": { '$regex': req.params.findme, '$options': 'i' }},
                        { "identify.product": { '$regex': req.params.findme, '$options': 'i' }},
                        { "identify.version": { '$regex': req.params.findme, '$options': 'i' }},
                        { "identify.notes": { '$regex': req.params.findme, '$options': 'i' }}
                    ]})
                    .populate('fromId')
                    .populate('locationId')
                    .then(function(many) {
                    let search = req.params.findme;
                    res.render("../view/report/find", { many, user, search });
                }).catch(function(err) {
                    console.log(err);
                    let many = '';
                    let search = req.params.findme;
                    res.render("../view/report/find", { many, user, search });
                })
            } else {
                let many = '';
                let search = req.params.findme;
                res.render("../view/report/find", { many, user, search });
            }
        }
    }
}

reportController.statistics = function (req, res) {
    const user = req.user;
    const oneMonthAgo = () => {
        const now = Date.now();
        const result = new Date(now);
        result.setMonth(result.getMonth() - 1);
        return result;
    };
    if (req.user.admin) {
        let totalSellPrice = 0;
        let totalBuyPrice = 0;
        let processFee = 0;
        let wipeFee = 0;
        let profit = 0;
        Item.aggregate([
            {
                $match: {
                    created: { $gte: oneMonthAgo() } // Filter documents created in the last month
                }
            }
        ]).then(function(result) {
            Cpu.find({processorFamily: { $ne: null }})
                .populate('processorFamily')
                .then(function (processors) {
                    Monitor.find({})
                        .then(function (monitors) {
                            ModelOverride.find({})
                                .then(function (model) {
                                    for(let i=0; i < result.length; i++) {
                                        let buyPrice = 0;
                                        let sellPrice = 0;
                                        if (['Aio', 'Desktop', 'Laptop'].includes(result[i].itemType)) {
                                            let processorCpu = result[i].specifications.processor;
                                            for (let procList = 0; procList < processors.length; procList++) {
                                                if (processors[procList].model == processorCpu) {
                                                    switch (result[i].itemType) {
                                                        case 'Aio':
                                                            if (result[i].identify.brand.includes('Apple')) {
                                                                buyPrice = parseFloat(processors[procList].processorFamily.imac.buyPrice);
                                                                sellPrice = parseFloat(processors[procList].processorFamily.imac.sellPrice);
                                                            } else {
                                                                buyPrice = parseFloat(processors[procList].processorFamily.aio.buyPrice);
                                                                sellPrice = parseFloat(processors[procList].processorFamily.aio.sellPrice);
                                                            }
                                                            break;
                                                        case 'Desktop':
                                                            buyPrice = parseFloat(processors[procList].processorFamily.desktop.buyPrice);
                                                            sellPrice = parseFloat(processors[procList].processorFamily.desktop.sellPrice);
                                                            break;
                                                        case 'Laptop':
                                                            if (result[i].identify.brand.includes('Apple')) {
                                                                buyPrice = parseFloat(processors[procList].processorFamily.macbook.buyPrice);
                                                                sellPrice = parseFloat(processors[procList].processorFamily.macbook.sellPrice);
                                                            } else {
                                                                buyPrice = parseFloat(processors[procList].processorFamily.laptop.buyPrice);
                                                                sellPrice = parseFloat(processors[procList].processorFamily.laptop.sellPrice);
                                                            }
                                                            break;
                                                    }
                                                }
                                            }
                                        } else if (result[i].itemType === 'Monitor') {
                                            for (let monList = 0; monList < monitors.length; monList++) {
                                                if (result[i].specifications.screenSize == monitors[monList].size.toString()) {
                                                    buyPrice = parseFloat(monitors[monList].buyPrice);
                                                    sellPrice = parseFloat(monitors[monList].sellPrice);
                                                }
                                            }
                                        }
                                        for (let modelO = 0; modelO < model.length; modelO++) {
                                            if (result[i].identify.product == model[modelO].model) {
                                                buyPrice = parseFloat(model[modelO].buyPrice);
                                                sellPrice = parseFloat(model[modelO].sellPrice);
                                            }
                                        }
                                        totalBuyPrice += buyPrice;
                                        totalSellPrice += sellPrice;
                                    }
                                    totalBuyPrice = -totalBuyPrice;
                                    processFee = result.length * 4;
                                    Wipe.aggregate([
                                        {
                                            $match: {
                                                created: { $gte: oneMonthAgo() } // Filter documents created in the last month
                                            }
                                        }
                                        ]).then(function(wipes){
                                            wipeFee = wipes.length * 4;
                                            profit = totalSellPrice + totalBuyPrice + processFee + wipeFee;
                                            res.render("../view/report/statistics", {user, totalBuyPrice, profit, totalSellPrice, processFee, wipeFee});
                                    }).catch(function(err) {
                                        console.log(err);
                                    });

                                }).catch(function(err) {
                                console.log(err);
                            });
                        }).catch(function(err) {
                        console.log(err);
                    });
                }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err) {
            console.log(err);
        });
    }
}

reportController.sustain = function(req, res) {
    if(req.user.jobR) {
        Job.findById(req.params.id)
            .populate('wipeList')
            .populate({path: 'itemList', options: { sort: { itemType: 1 , 'identify.brand': 1, 'identify.product': 1} }})
            .then(function (one) {
            Cpu.find({processorFamily: { $ne: null }})
                .populate('processorFamily')
                .then(function (processors) {
                Monitor.find({})
                    .then(function (monitors) {
                    ModelOverride.find({})
                        .then(async function (model) {
                        const workbook = new Excel.Workbook();
                        workbook.views = [
                            {
                                x: 0, y: 0, width: 10000, height: 20000,
                                firstSheet: 0, activeTab: 1, visibility: 'visible'
                            }
                            ];
                        workbook.calcProperties.fullCalcOnLoad = true;
                        const sheet = workbook.addWorksheet(one.fromBarcode, {views: [{showGridLines: false}]}, {
                            pageSetup: {fitToWidth: 1, paperSize: 9, orientation: 'landscape'}
                        });
                        sheet.properties.defaultRowHeight = 16;
                        sheet.pageSetup.margins = {
                            left: 0.64, right: 0.64,
                            top: 0.75, bottom: 0.75,
                            header: 0, footer: 0
                        };

                        const topRows = [
                            [''], [''], [''],
                            ['Final Valuation for Equipment Buyback'],
                            [one.businessName],
                            [''], [''],
                            ['Quote #', 'Final Valuation Date'],
                            [one.fromBarcode, ''], ['']
                        ];
                        const imageSustain = workbook.addImage({
                            filename: 'public/bshw-big.png',
                            extension: 'png',
                        });

                        sheet.addRows(topRows);
                        sheet.addImage(imageSustain, 'A1:B3');

                        sheet.columns = [
                            {key: 'qty', width: 19},
                            {key: 'code', width: 29},
                            {key: 'type', width: 21},
                            {key: 'bm', width: 55},
                            {key: 'serial', width: 55},
                            {key: 'cpu', width: 60},
                            {key: 'ram', width: 18},
                            {key: 'hdd', width: 18},
                            {key: 'grade', width: 18},
                            {key: 'notes', width: 95},
                            {key: 'itemPrice', width: 21},
                            {key: 'totalPrice', width: 21}
                        ];
                        sheet.getRow(11).values = ['Quantity', 'Code', 'Product Type', 'Description', 'Serial', 'CPU', 'RAM',
                            'Storage', 'Final Grade', 'Comments', 'Item Price \n(inc GST)', 'Total Price \n(inc GST)'];

                        for (let i = 0; i < one.itemList.length; i++) {
                            let desc = [one.itemList[i].identify.brand, one.itemList[i].identify.product,
                                one.itemList[i].identify.version].join(' ');
                            let faults = '';
                            Object.entries(one.itemList[i].faults).forEach(([key, value]) => {
                                if (value == true) {
                                    faults += key;
                                    faults += ' ';
                                }
                            })
                            Object.entries(one.itemList[i].globalFaults).forEach(([key, value]) => {
                                if (value == true) {
                                    faults += key;
                                    faults += ' ';
                                }
                            })
                            if (one.itemList[i].cosmeticCondition!='goodCondition') {
                                faults += one.itemList[i].cosmeticCondition;
                                faults += ' ';
                            }
                            faults += one.itemList[i].identify.notes;
                            let processorCpu = '';
                            let hardDrive = '';
                            let ramIncluded = '';
                            let itemPrice = 0;
                            let itemP = 0;
                            let totalPrice = 0;
                            if (['Aio', 'Desktop', 'Laptop'].includes(one.itemList[i].itemType)) {
                                processorCpu = one.itemList[i].specifications.processor;
                                hardDrive = one.itemList[i].specifications.hardDrive;
                                ramIncluded = one.itemList[i].specifications.ramSize;
                                for (let procList = 0; procList < processors.length; procList++) {
                                    if (processors[procList].model == processorCpu) {
                                        switch (one.itemList[i].itemType) {
                                            case 'Aio':
                                                if (one.itemList[i].identify.brand.includes('Apple')) {
                                                    itemPrice = parseFloat(processors[procList].processorFamily.imac.buyPrice);
                                                } else {
                                                    itemPrice = parseFloat(processors[procList].processorFamily.aio.buyPrice);
                                                }
                                                break;
                                            case 'Desktop':
                                                itemPrice = parseFloat(processors[procList].processorFamily.desktop.buyPrice);
                                                break;
                                            case 'Laptop':
                                                if (one.itemList[i].identify.brand.includes('Apple')) {
                                                    itemPrice = parseFloat(processors[procList].processorFamily.macbook.buyPrice);
                                                } else {
                                                    itemPrice = parseFloat(processors[procList].processorFamily.laptop.buyPrice);
                                                }
                                                break;
                                        }
                                    }
                                }
                            } else if (one.itemList[i].itemType === 'Monitor') {
                                for (let monList = 0; monList < monitors.length; monList++) {
                                    if (one.itemList[i].specifications.screenSize == monitors[monList].size.toString()) {
                                        itemPrice = parseFloat(monitors[monList].buyPrice);
                                    }
                                }
                            }
                            for (let modelO = 0; modelO < model.length; modelO++) {
                                if (one.itemList[i].identify.product == model[modelO].model) {
                                    itemPrice = parseFloat(model[modelO].buyPrice);
                                }
                            }
                            totalPrice = itemPrice;
                            let currentRow = {
                                qty: 1,
                                type: one.itemList[i].itemType,
                                bm: desc,
                                serial: one.itemList[i].identify.serial,
                                cpu: processorCpu,
                                ram: ramIncluded,
                                hdd: hardDrive,
                                notes: faults,
                                itemPrice: itemPrice,
                                totalPrice: totalPrice
                            };
                            sheet.addRow(currentRow).commit();
                        }
                        let processing = one.itemList.length;
                        let procTotal = processing * -4;
                        let procFee = {
                            qty: processing,
                            type: 'fee',
                            bm: 'per item processing fee',
                            serial: '',
                            cpu: '',
                            ram: '',
                            hdd: '',
                            notes: '',
                            itemPrice: -4,
                            totalPrice: procTotal
                        };
                        sheet.addRow(procFee).commit();
                        let hardproc = one.wipeList.length;
                        let hardTotal = hardproc * -4;
                        let hardFee = {
                            qty: hardproc, type: 'fee', bm: 'per drive wipe fee', serial: '', cpu: '',
                            ram: '', hdd: '',
                            notes: '', itemPrice: -4, totalPrice: hardTotal
                        };
                        sheet.addRow(hardFee).commit();
                        sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                            row.font = {name: 'Calibri'};
                        });
                        sheet.getRow(2).height = 85;
                        sheet.getRow(2).getCell(12).value = ''; //business name
                        sheet.getRow(2).getCell(12).font = {size: 12, bold: true, name: 'Calibri'};
                        sheet.getRow(2).getCell(12).alignment = {horizontal: 'right'};
                        sheet.getRow(3).height = 18;
                        sheet.getRow(3).getCell(12).value = ''; // business address
                        sheet.getRow(3).getCell(12).alignment = {horizontal: 'right'};
                        sheet.getRow(4).height = 30;
                        sheet.getRow(4).getCell(1).font = {size: 20, bold: true, name: 'Calibri'};
                        sheet.getRow(4).getCell(12).value = ''; // business email
                        sheet.getRow(4).getCell(12).alignment = {
                            vertical: 'middle',
                            horizontal: 'right'
                        };
                        sheet.getRow(5).getCell(1).font = {
                            color: {argb: '00FF0000'},
                            size: 14,
                            bold: true,
                            name: 'Calibri'
                        };
                        sheet.getRow(5).height = 17;
                        sheet.getRow(5).getCell(12).value = ``; // ABN
                        sheet.getRow(5).getCell(12).alignment = {
                            vertical: 'middle',
                            horizontal: 'right'
                        };
                        sheet.getRow(6).height = 17;
                        sheet.getRow(7).height = 17;
                        sheet.getRow(8).height = 15;
                        sheet.getRow(8).eachCell({includeEmpty: true}, function (cell, cellNumber) {
                            if (cellNumber < 3) {
                                cell.border = {
                                    top: {style: 'thin'},
                                    left: {style: 'thin'},
                                    bottom: {style: 'thin'},
                                    right: {style: 'thin'}
                                };
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: {argb: 'dce6f2'},
                                };
                                cell.font = {size: 11, bold: true, name: 'Calibri'}
                                cell.alignment = {horizontal: 'center'};
                            }
                        });
                        sheet.getRow(9).eachCell({includeEmpty: true}, function (cell, cellNumber) {
                            if (cellNumber < 3) {
                                cell.border = {
                                    top: {style: 'thin'},
                                    left: {style: 'thin'},
                                    bottom: {style: 'thin'},
                                    right: {style: 'thin'}
                                };
                            }
                        });
                        sheet.getRow(9).height = 21;
                        sheet.getRow(11).height = 35;
                        sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                            if (rowNumber > 10) {
                                row.eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                    cell.border = {
                                        top: {style: 'thin'},
                                        left: {style: 'thin'},
                                        bottom: {style: 'thin'},
                                        right: {style: 'thin'}
                                    };
                                })
                                if (rowNumber == 11) {
                                    row.eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                        if (cellNumber < 13) {
                                            cell.fill = {
                                                type: 'pattern',
                                                pattern: 'solid',
                                                fgColor: {argb: 'dce6f2'},
                                            };
                                            cell.font = {size: 11, bold: true, name: 'Calibri'};
                                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                                        }
                                    })
                                }
                                if (rowNumber > 11) {
                                    row.getCell(11).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                                    row.getCell(12).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                                    let quantCell = row.getCell(1).address;
                                    quantCell += `*`;
                                    quantCell += row.getCell(11).address;
                                    let totalResult = row.getCell(1).value * row.getCell(11);
                                    row.getCell(12).value = {result: totalResult, formula: quantCell};
                                }
                            }
                        });
                        let tally = 0;
                        sheet.getColumn(12).eachCell({includeEmpty: true}, function (cell, rowNumber) {
                            if (rowNumber > 11) {
                                tally += cell.result;
                            }
                        });
                        let topCell = sheet.getRow(12).getCell(12).address;
                        let bottomCell = sheet.lastRow.getCell(12).address;
                        let sumCell = ['SUM(', topCell, ':', bottomCell, ')'].join('');
                        sheet.addRow({itemPrice: 'Total', totalPrice: tally}).commit();
                        sheet.lastRow.getCell(11).border = {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        };
                        sheet.lastRow.getCell(11).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'ebf1de'},
                        };
                        sheet.lastRow.getCell(11).alignment = {horizontal: 'center'};
                        sheet.lastRow.getCell(11).font = {size: 14, bold: true, name: 'Calibri'};
                        sheet.lastRow.getCell(12).border = {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        };
                        sheet.lastRow.getCell(12).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'ebf1de'},
                        };
                        sheet.lastRow.getCell(12).font = {size: 14, bold: true, name: 'Calibri'};
                        sheet.lastRow.getCell(12).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                        sheet.lastRow.getCell(12).value = {result: tally, formula: sumCell};
                        sheet.addRows(['', '', '']);
                        let areaPrint = 'A1:';
                        areaPrint += sheet.lastRow.getCell(12).address;
                        sheet.pageSetup.printArea = areaPrint;
                        let fileNameExcel = ['\"', one.fromBarcode, '.xlsx\"'].join('');
                        res.set({
                            'Content-Disposition': 'attachment; filename=' + fileNameExcel,
                            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        let fileBuffer = await workbook.xlsx.writeBuffer();
                        res.send(fileBuffer);
                    }).catch(function(err4) {
                        console.log(err4);
                    });
                }).catch(function(err3) {
                    console.log(err3);
                });
            }).catch(function(err2) {
                console.log(err2);
            });
        }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

reportController.location = function(req, res) {
    if(req.user.locationR) {
        Location.findById(req.params.id)
            .populate({path: 'itemList', options: { sort: { itemType: 1, 'identify.brand': 1, 'identify.product': 1} }})
            .then(function (one) {
                Cpu.find({processorFamily: { $ne: null }})
                    .populate('processorFamily')
                    .then(function (processors) {
                        Monitor.find({})
                            .then(function (monitors) {
                                ModelOverride.find({})
                                    .then(async function (model) {
                                        const workbook = new Excel.Workbook();
                                        workbook.views = [
                                            {
                                                x: 0, y: 0, width: 10000, height: 20000,
                                                firstSheet: 0, activeTab: 1, visibility: 'visible'
                                            }
                                        ];
                                        workbook.calcProperties.fullCalcOnLoad = true;
                                        const sheet = workbook.addWorksheet(one.locate, {views: [{showGridLines: false}]}, {
                                            pageSetup: {fitToWidth: 1, paperSize: 9, orientation: 'landscape'}
                                        });
                                        sheet.properties.defaultRowHeight = 16;
                                        sheet.pageSetup.margins = {
                                            left: 0.64, right: 0.64,
                                            top: 0.75, bottom: 0.75,
                                            header: 0, footer: 0
                                        };
                                        let dateNow = new Date();
                                        let dateConvert = "";
                                        dateConvert += dateNow.getDate().toString().padStart(2,0) + '/'
                                            + (dateNow.getMonth()+1).toString().padStart(2,0) + '/'
                                            + dateNow.getFullYear();
                                        const topRows = [
                                            [''], [''], [''],
                                            ['Approximate pricing'],
                                            [one.notes],
                                            [''], [''],
                                            ['Quote #', 'Date'],
                                            [one.locate, dateConvert], ['']
                                        ];
                                        const imageAtech = workbook.addImage({
                                            filename: 'public/bshw-big.png',
                                            extension: 'png',
                                        });

                                        sheet.addRows(topRows);
                                        sheet.addImage(imageAtech, 'A1:B2');


                                        sheet.columns = [
                                            {key: 'id', width: 15}, // original 20
                                            {key: 'type', width: 15}, // original 20
                                            {key: 'bm', width: 30}, // original 60
                                            {key: 'serial', width: 15}, // original 30
                                            {key: 'cpu', width: 45}, // original 60
                                            {key: 'ram', width: 10}, // original 20
                                            {key: 'hdd', width: 10}, // original 20
                                            {key: 'notes', width: 45}, // original 95
                                            {key: 'itemPrice', width: 20}, // original 20
                                            //{key: 'totalPrice', width: 21}
                                        ];
                                        sheet.getRow(11).values = ['ID', 'Type', 'Description', 'Serial', 'CPU', 'RAM',
                                            'Storage', 'Comments', 'Price \n(ex GST)'];

                                        for (let i = 0; i < one.itemList.length; i++) {
                                            let desc = [one.itemList[i].identify.brand, one.itemList[i].identify.product,
                                                one.itemList[i].identify.version].join(' ');
                                            let faults = '';
                                            Object.entries(one.itemList[i].faults).forEach(([key, value]) => {
                                                if (value == true) {
                                                    faults += key;
                                                    faults += ' ';
                                                }
                                            })
                                            Object.entries(one.itemList[i].globalFaults).forEach(([key, value]) => {
                                                if (value == true) {
                                                    faults += key;
                                                    faults += ' ';
                                                }
                                            })
                                            if (one.itemList[i].cosmeticCondition!='goodCondition') {
                                                faults += one.itemList[i].cosmeticCondition;
                                                faults += ' ';
                                            }
                                            faults += one.itemList[i].identify.notes;
                                            let processorCpu = '';
                                            let hardDrive = '';
                                            let ramIncluded = '';
                                            let itemPrice = 0;
                                            let itemP = 0;
                                            let totalPrice = 0;
                                            if (['Aio', 'Desktop', 'Laptop'].includes(one.itemList[i].itemType)) {
                                                processorCpu = one.itemList[i].specifications.processor;
                                                hardDrive = one.itemList[i].specifications.hardDrive;
                                                ramIncluded = one.itemList[i].specifications.ramSize;
                                                for (let procList = 0; procList < processors.length; procList++) {
                                                    if (processors[procList].model == processorCpu) {
                                                        switch (one.itemList[i].itemType) {
                                                            case 'Aio':
                                                                if (one.itemList[i].identify.brand.includes('Apple')) {
                                                                    itemPrice = parseFloat(processors[procList].processorFamily.imac.sellPrice);
                                                                } else {
                                                                    itemPrice = parseFloat(processors[procList].processorFamily.aio.sellPrice);
                                                                }
                                                                break;
                                                            case 'Desktop':
                                                                itemPrice = parseFloat(processors[procList].processorFamily.desktop.sellPrice);
                                                                break;
                                                            case 'Laptop':
                                                                if (one.itemList[i].identify.brand.includes('Apple')) {
                                                                    itemPrice = parseFloat(processors[procList].processorFamily.macbook.sellPrice);
                                                                } else {
                                                                    itemPrice = parseFloat(processors[procList].processorFamily.laptop.sellPrice);
                                                                }
                                                                break;
                                                        }
                                                    }
                                                }
                                            } else if (one.itemList[i].itemType === 'Monitor') {
                                                for (let monList = 0; monList < monitors.length; monList++) {
                                                    if (one.itemList[i].specifications.screenSize == monitors[monList].size.toString()) {
                                                        itemPrice = parseFloat(monitors[monList].sellPrice);
                                                    }
                                                }
                                            }
                                            for (let modelO = 0; modelO < model.length; modelO++) {
                                                if (one.itemList[i].identify.product == model[modelO].model) {
                                                    itemPrice = parseFloat(model[modelO].sellPrice);
                                                }
                                            }
                                            totalPrice = itemPrice;
                                            let currentRow = {
                                                id: one.itemList[i].identify.idBarcode,
                                                type: one.itemList[i].itemType,
                                                bm: desc,
                                                serial: one.itemList[i].identify.serial,
                                                cpu: processorCpu,
                                                ram: ramIncluded,
                                                hdd: hardDrive,
                                                notes: faults,
                                                itemPrice: itemPrice
                                            };
                                            sheet.addRow(currentRow).commit();
                                        }
                                        sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                                            row.font = {name: 'Calibri'};
                                        });
                                        sheet.getRow(2).height = 40;
                                        sheet.getRow(2).getCell(9).value = ''; // company name
                                        sheet.getRow(2).getCell(9).font = {size: 12, bold: true, name: 'Calibri'};
                                        sheet.getRow(2).getCell(9).alignment = {horizontal: 'right'};
                                        sheet.getRow(3).height = 18;
                                        sheet.getRow(3).getCell(9).value = ''; // company address
                                        sheet.getRow(3).getCell(9).alignment = {horizontal: 'right'};
                                        sheet.getRow(4).height = 30;
                                        sheet.getRow(4).getCell(1).font = {size: 20, bold: true, name: 'Calibri'};
                                        sheet.getRow(4).getCell(9).value = ''; // company email
                                        sheet.getRow(4).getCell(9).alignment = {
                                            vertical: 'middle',
                                            horizontal: 'right'
                                        };
                                        sheet.getRow(5).getCell(1).font = {
                                            color: {argb: '00FF0000'},
                                            size: 14,
                                            bold: true,
                                            name: 'Calibri'
                                        };
                                        sheet.getRow(5).height = 17;
                                        sheet.getRow(5).getCell(9).value = ``; // ABN
                                        sheet.getRow(5).getCell(9).alignment = {
                                            vertical: 'middle',
                                            horizontal: 'right'
                                        };
                                        sheet.getRow(6).height = 17;
                                        sheet.getRow(7).height = 17;
                                        sheet.getRow(8).height = 15;
                                        sheet.getRow(8).eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                            if (cellNumber < 3) {
                                                cell.border = {
                                                    top: {style: 'thin'},
                                                    left: {style: 'thin'},
                                                    bottom: {style: 'thin'},
                                                    right: {style: 'thin'}
                                                };
                                                cell.fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: {argb: 'dce6f2'},
                                                };
                                                cell.font = {size: 11, bold: true, name: 'Calibri'}
                                                cell.alignment = {horizontal: 'center'};
                                            }
                                        });
                                        sheet.getRow(9).eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                            if (cellNumber < 3) {
                                                cell.border = {
                                                    top: {style: 'thin'},
                                                    left: {style: 'thin'},
                                                    bottom: {style: 'thin'},
                                                    right: {style: 'thin'}
                                                };
                                            }
                                        });
                                        sheet.getRow(9).height = 21;
                                        sheet.getRow(11).height = 35;
                                        sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                                            if (rowNumber > 10) {
                                                row.eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                                    cell.border = {
                                                        top: {style: 'thin'},
                                                        left: {style: 'thin'},
                                                        bottom: {style: 'thin'},
                                                        right: {style: 'thin'}
                                                    };
                                                })
                                                if (rowNumber == 11) {
                                                    row.eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                                        if (cellNumber < 10) {
                                                            cell.fill = {
                                                                type: 'pattern',
                                                                pattern: 'solid',
                                                                fgColor: {argb: 'dce6f2'},
                                                            };
                                                            cell.font = {size: 11, bold: true, name: 'Calibri'};
                                                            cell.alignment = {vertical: 'middle', horizontal: 'center'};
                                                        }
                                                    })
                                                }
                                                if (rowNumber > 11) {
                                                    row.getCell(9).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                                                }
                                            }
                                        });
                                        let tally = 0;
                                        sheet.getColumn(9).eachCell({includeEmpty: true}, function (cell, rowNumber) {
                                            if (rowNumber > 11) {
                                                tally += cell.value;
                                            }
                                        });
                                        let topCell = sheet.getRow(12).getCell(9).address;
                                        let bottomCell = sheet.lastRow.getCell(9).address;
                                        let sumCell = ['SUM(', topCell, ':', bottomCell, ')'].join('');
                                        sheet.addRow({notes: 'Total:', itemPrice: tally}).commit();
                                        sheet.lastRow.getCell(8).border = {
                                            top: {style: 'thin'},
                                            left: {style: 'thin'},
                                            bottom: {style: 'thin'},
                                            right: {style: 'thin'}
                                        };
                                        sheet.lastRow.getCell(8).fill = {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: {argb: 'ebf1de'},
                                        };
                                        sheet.lastRow.getCell(8).alignment = {horizontal: 'center'};
                                        sheet.lastRow.getCell(8).font = {size: 14, bold: true, name: 'Calibri'};
                                        sheet.lastRow.getCell(9).border = {
                                            top: {style: 'thin'},
                                            left: {style: 'thin'},
                                            bottom: {style: 'thin'},
                                            right: {style: 'thin'}
                                        };
                                        sheet.lastRow.getCell(9).fill = {
                                            type: 'pattern',
                                            pattern: 'solid',
                                            fgColor: {argb: 'ebf1de'},
                                        };
                                        sheet.lastRow.getCell(9).font = {size: 14, bold: true, name: 'Calibri'};
                                        sheet.lastRow.getCell(9).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                                        sheet.lastRow.getCell(9).value = {result: tally, formula: sumCell};
                                        sheet.addRows(['', '', '']);
                                        let areaPrint = 'A1:';
                                        areaPrint += sheet.lastRow.getCell(9).address;
                                        sheet.pageSetup.printArea = areaPrint;
                                        let fileNameExcel = ['\"', one.locate, '.xlsx\"'].join('');
                                        res.set({
                                            'Content-Disposition': 'attachment; filename=' + fileNameExcel,
                                            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                        });
                                        let fileBuffer = await workbook.xlsx.writeBuffer();
                                        res.send(fileBuffer);
                                    }).catch(function(err4) {
                                    console.log(err4);
                                });
                            }).catch(function(err3) {
                            console.log(err3);
                        });
                    }).catch(function(err2) {
                    console.log(err2);
                });
            }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}

reportController.data = function(req, res) {
    if(req.user.jobR) {
        Job.findById(req.params.id)
            .populate({ path: 'wipeList', populate: { path: 'itemId'}})
            .then(async function (one) {
                const workbook = new Excel.Workbook();
                workbook.views = [
                    {
                        x: 0, y: 0, width: 10000, height: 20000,
                        firstSheet: 0, activeTab: 1, visibility: 'visible'
                    }
                ];
                workbook.calcProperties.fullCalcOnLoad = true;
                const sheet = workbook.addWorksheet(one.fromBarcode, {views: [{showGridLines: false}]}, {
                    pageSetup: {fitToWidth: 1, paperSize: 9, orientation: 'landscape'}
                });
                sheet.properties.defaultRowHeight = 16;
                sheet.pageSetup.margins = {
                    left: 0.64, right: 0.64,
                    top: 0.75, bottom: 0.75,
                    header: 0, footer: 0
                };

                const topRows = [
                    [''], [''], [''],
                    ['Data Erasure Report'],
                    [one.businessName],
                    [''], [''],
                    ['Count #', 'Completion Date'],
                    [one.wipeList.length, one.completionDate], ['']
                ];
                const imageAtech = workbook.addImage({
                    filename: 'public/bshw-big.png',
                    extension: 'png'
                })


                sheet.addRows(topRows);
                sheet.addImage(imageAtech, 'F4:F6');

                sheet.columns = [
                    {key: 'serial', width: 30},
                    {key: 'model', width: 50},
                    {key: 'source', width: 50},
                    {key: 'size', width: 15},
                    {key: 'started', width: 45},
                    {key: 'result', width: 45}
                ];
                sheet.getRow(11).values = ['Serial', 'Model', 'Source', 'Size', 'Started', 'Result'];

                for (let i = 0; i < one.wipeList.length; i++) {
                    let desc;
                    if (typeof one.wipeList[i].itemId !== 'undefined') {
                        desc = [one.wipeList[i].itemId.identify.serial, one.wipeList[i].itemId.identify.idBarcode].join(' ');
                    } else {
                        desc = 'External Wipe';
                    }
                    let started = '';
                    if (one.wipeList[i].started) {
                        started = 'Wipe started: ' + one.wipeList[i].startedDate.toLocaleString();
                    }
                    let completed = '';
                    if (one.wipeList[i].finished) {
                        completed = 'Wipe completed: ' + one.wipeList[i].finishedDate.toLocaleString();
                    } else if (one.wipeList[i].faulty) {
                        completed = 'Device destroyed: ' + one.wipeList[i].faultyDate.toLocaleString();
                    }
                    let currentRow = {
                        serial: one.wipeList[i].serial,
                        model: one.wipeList[i].product,
                        source: desc,
                        size: one.wipeList[i].size,
                        started: started,
                        result: completed
                    };

                    sheet.addRow(currentRow).commit();
                }
                sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                    row.font = {name: 'Calibri'};
                });

                sheet.getRow(2).height = 40;
                sheet.getRow(2).getCell(6).value = ''; // business name
                sheet.getRow(2).getCell(6).font = {size: 12, bold: true, name: 'Calibri'};
                sheet.getRow(2).getCell(6).alignment = {horizontal: 'right'};
                sheet.getRow(3).height = 18;
                sheet.getRow(3).getCell(6).value = ''; // business address
                sheet.getRow(3).getCell(6).alignment = {horizontal: 'right'};
                sheet.getRow(4).height = 30;
                sheet.getRow(4).getCell(1).font = {size: 20, bold: true, name: 'Calibri'};
                sheet.getRow(4).getCell(6).value = ''; // business email
                sheet.getRow(4).getCell(6).alignment = {
                    vertical: 'middle',
                    horizontal: 'right'
                };
                sheet.getRow(5).getCell(1).font = {
                    color: {argb: '00FF0000'},
                    size: 14,
                    bold: true,
                    name: 'Calibri'
                };
                sheet.getRow(5).height = 17;
                sheet.getRow(5).getCell(6).value = ``; //ABN
                sheet.getRow(5).getCell(6).alignment = {
                    vertical: 'middle',
                    horizontal: 'right'
                };
                sheet.getRow(6).height = 17;
                sheet.getRow(7).height = 17;
                sheet.getRow(8).height = 15;
                sheet.getRow(8).eachCell({includeEmpty: true}, function (cell, cellNumber) {
                    if (cellNumber < 3) {
                        cell.border = {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        };
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'dce6f2'},
                        };
                        cell.font = {size: 11, bold: true, name: 'Calibri'}
                        cell.alignment = {horizontal: 'center'};
                    }
                });
                sheet.getRow(9).eachCell({includeEmpty: true}, function (cell, cellNumber) {
                    if (cellNumber < 3) {
                        cell.border = {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        };
                    }
                });
                sheet.getRow(9).height = 21;
                sheet.getRow(11).height = 35;

                sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                    if (rowNumber > 10) {
                        row.eachCell({includeEmpty: true}, function (cell, cellNumber) {
                            cell.border = {
                                top: {style: 'thin'},
                                left: {style: 'thin'},
                                bottom: {style: 'thin'},
                                right: {style: 'thin'}
                            };
                        })
                        if (rowNumber == 11) {
                            row.eachCell({includeEmpty: true}, function (cell, cellNumber) {
                                if (cellNumber < 7) {
                                    cell.fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: {argb: 'dce6f2'},
                                    };
                                    cell.font = {size: 11, bold: true, name: 'Calibri'};
                                    cell.alignment = {vertical: 'middle', horizontal: 'center'};
                                }
                            })
                        }
                    }
                });

                let areaPrint = 'A1:';
                areaPrint += sheet.lastRow.getCell(6).address;
                sheet.pageSetup.printArea = areaPrint;
                let fileNameExcel = ['\"', one.fromBarcode, '-DD.xlsx\"'].join('');
                res.set({
                    'Content-Disposition': 'attachment; filename=' + fileNameExcel,
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                let fileBuffer = await workbook.xlsx.writeBuffer();
                res.send(fileBuffer);
            }).catch(function(err) {
            console.log(err);
        });
    } else {
        console.log(req.user.username, "permission denied: admin");
        res.redirect("/");
    }
}


module.exports = reportController;
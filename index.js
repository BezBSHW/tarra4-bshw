const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = global.Promise;

const uri = 'mongodb://user:pass:10.10.0.1:27017/';

mongoose.connect(uri).then(() => {
    console.log("Mongoose is connected");
}, err => {
    console.log(err);
});

/**
 * Route inclusion declaration
 */
const index = require('./route/index.js');
//const apiAuto = require('./route/apiAuto.js');
//const apiJob = require('./route/apiJob.js');
//const apiWipe = require('./route/apiWipe.js');
//const apiLocation = require('./route/apiLocation.js');
const htmlJob = require('./route/htmlJob.js');
const htmlWipe = require('./route/htmlWipe.js');
const htmlItem = require('./route/htmlItem.js');
const htmlUser = require('./route/htmlUser.js');
const htmlLocation = require('./route/htmlLocation.js');
const htmlPrice = require('./route/htmlPrice.js');
const htmlAdmin = require('./route/htmlAdmin.js');
const htmlReport = require('./route/htmlReport.js');

const app = express();

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: 'bshw',
    secret: 'hardware report',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

const User = require('./model/User.js');
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

User.countDocuments({'admin': true})
    .then(function(count) {
    if(count>0) {
        console.log("Admin account found.");
    } else {
        User.register(new User({username: 'Admin'}), 'BezBez0').then(() =>{ //change this per server
            console.log("Admin account added.")
        }).catch(function(err2) {
            console.log(err2);
        });
    }
}).catch(function(err) {
    console.log(err);
    User.register(new User({username: 'Admin'}), 'BezBez0').then(() =>{ //change this per server
        console.log("Admin account added.")
    }).catch(function(err2) {
        console.log(err2);
    });
})


/**/

logger.token('ip', function(req) {
    let ip;
    try {
        ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        return ip;
    } catch (e) {
        ip = "";
        return ip;
    }
})

logger.token('user', function(req) {
    if (req.user) {
        return req.user.username;
    } else {
        return 0;
    }
})

app.enable("trust proxy");
app.use(logger(':ip\t:user\t:method\t:status\t:response-time[0]\t:res[content-length]\t:url'));
app.use(express.json());
app.use(cookieParser());

/**
 * url pathing
 */
app.use('/', index);
//app.use('/apia', apiAuto);
app.use('/job', htmlJob);
//app.use('/apij', apiJob);
app.use('/wipe', htmlWipe);
//app.use('/apiw', apiWipe);
app.use('/item', htmlItem);
app.use('/user', htmlUser);
app.use('/location', htmlLocation);
//app.use('/apil', apiLocation);
app.use('/price', htmlPrice);
app.use('/admin', htmlAdmin);
app.use('/report', htmlReport);


app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login?info=' + info);
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
});

router.get('/login',
    (req, res) => res.sendFile('login.html', {root: __dirname} )
);

router.get('/',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => res.sendFile('index.html', {root: __dirname} )
);

router.get('/style.css',
    (req, res) => res.sendFile('style.css', {root: __dirname} )
);

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;

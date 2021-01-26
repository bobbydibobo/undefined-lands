/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');

/*----------------------
ROUTER INIT
----------------------*/
const router = express.Router();

/*----------------------
CUSTOM FUNCTIONS
----------------------*/
const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/user/login');
}

/*----------------------
ROUTES
----------------------*/
router.get('/', checkAuth, (req, res) => {
    res.render('game', {
        name: req.user.username,
        title: req.user.title,
        level: req.user.level,
        coins: req.user.coins,
        stats: req.user.stats,
        army: req.user.army,
        capacity: req.user.capacity,
        map: req.user.map
    });
});

module.exports = router;
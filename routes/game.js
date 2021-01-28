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
        id: req.user.id,
        name: req.user.username,
        level: req.user.level,
        coins: req.user.coins,
        stats: req.user.stats,
        army: req.user.army,
        supplies: req.user.supplies,
        map: req.user.map
    });
});

router.get('/userupdate', (req, res) => {
    res.render('updateUser', {
        id: req.user.id,
        name: req.user.username,
        level: req.user.level,
        coins: req.user.coins,
        stats: req.user.stats,
        army: req.user.army,
        supplies: req.user.supplies,
        map: req.user.map
    });
});

router.put('/updateLvl', async (req, res) => {
    let user = req.user;
    user.level = req.user.level;

    try{
        user.level++;
        await user.save();
        res.redirect('/game');
    } catch {
        res.redirect('/game');
    }
});

module.exports = router;
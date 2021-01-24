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
    res.render('index', { name: req.user.username });
});

module.exports = router;
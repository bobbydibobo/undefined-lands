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
const checkNotAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/game');
    }

    next();
}

/*----------------------
ROUTES
----------------------*/
router.get('/',checkNotAuth, (req, res) => {
    res.render('index');
});

module.exports = router;
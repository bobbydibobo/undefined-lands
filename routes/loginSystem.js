/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');

/*----------------------
ROUTER
----------------------*/
const router = express.Router();

/*----------------------
ROUTES
----------------------*/
//register routes
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    res.send('thx');
});

//login routes
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    res.send('thx');
});

module.exports = router; 
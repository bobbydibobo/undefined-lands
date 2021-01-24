/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

/*----------------------
ROUTER INIT
----------------------*/
const router = express.Router();

/*----------------------
TEMP USER
----------------------*/
const users = [];

/*----------------------
PASSPORT
----------------------*/
const initializePassport = require('../config/passport');
initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
);

/*----------------------
CUSTOM FUNCTIONS
----------------------*/
const checkNotAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
}

/*----------------------
ROUTES
----------------------*/
//register routes
router.get('/register', checkNotAuth, (req, res) => {
    res.render('register');
});

router.post('/register', checkNotAuth, async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            password: hashedPassword
        })

        res.redirect('/user/login');
    } catch {
        res.redirect('/user/register');
    }

    console.log(users);
});


//login routes
router.get('/login', checkNotAuth, (req, res) => {
    res.render('login');
});

router.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}));

//logout route
router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
});

module.exports = router;
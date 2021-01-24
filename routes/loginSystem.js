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
USER
----------------------*/
const User = require('../models/User');

/*----------------------
TEMP USER
----------------------*/
//const users = [];

/*----------------------
PASSPORT
----------------------*/
const initializePassport = require('../config/passport');
initializePassport(
    passport,
    username => User.find(user => user.username === username),
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

router.post('/register', checkNotAuth, (req, res) => {

    //temp user Object
    const {username, password} = req.body;

    //error Array -> print messages
    let errors = [];

    //Validation
    if(!username || !password) {
        errors.push({ message: 'Please fill in all fields!' });
    }

    if(password.length < 6) {
        errors.push({ message: 'Your password should at least have 6 characters!' });
    }

    if(errors.length > 0) {
        res.render('register', {
            errors
        }); 
    } else {
        User.findOne({ username:username })
        .then(user => {
            if(user) {
                errors.push({ message: 'Username is already taken!' });

                res.render('register', {
                    errors
                });
            } else {
                const newUser = new User({
                    username,
                    password
                });

                //Hash the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        //Set pw to hashed
                        newUser.password = hash;

                        console.log(newUser);
                        //Save user to db
                        newUser.save()
                        .then(() => {
                            res.redirect('/user/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }

   /* try{
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

    console.log(users);*/
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
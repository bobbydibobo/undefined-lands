/*----------------------
LOAD ENV VARS
----------------------*/
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

/*----------------------
INIT APP
----------------------*/
const app = express();

/*----------------------
DB CONFIG
----------------------*/
const dbConnect = require('./config/keys').MongoURI

mongoose.connect(dbConnect, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

/*----------------------
EJS MIDDLEWARE
----------------------*/
app.use(expressLayouts);
app.set('view engine', 'ejs');

/*----------------------
EXP SESSION & FLASH MIDDLEWARE
----------------------*/
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

/*----------------------
PASSPORT MIDDLEWARE
----------------------*/
app.use(passport.initialize());
app.use(passport.session());

/*----------------------
METHOD OVERRIDE MIDDLEWARE
----------------------*/
app.use(methodOverride('_method'));

/*----------------------
BODYPARSER MIDDLEWARE
----------------------*/
app.use(express.urlencoded({ extended: false }));

/*-------------------------------
MIDDLEWARE STATIC FOLDERS
-------------------------------*/
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));

/*----------------------
ROUTES
----------------------*/
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/loginSystem'));
app.use('/game', require('./routes/game'));
app.use('/quests', require('./routes/quests'))

/*----------------------
PORT
----------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected to PORT ${PORT}`));
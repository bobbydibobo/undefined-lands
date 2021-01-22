/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

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
app.use('/hello', require('./routes/index'));

/*----------------------
PORT
----------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected to PORT ${PORT}`));
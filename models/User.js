/*----------------------
BIND DEPENDENCIES
----------------------*/
const mongoose = require('mongoose');

/*----------------------
Schema
----------------------*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

/*----------------------
MODEL
----------------------*/
const User = mongoose.model('User', userSchema);

module.exports = User;
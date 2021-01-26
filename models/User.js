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
    },
    date: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        default: 'Major Dissapointment'
    },
    level: {
        type: Number,
        default: 1
    },
    coins: {
        type: Number,
        default: 500
    },
    stats: {
        type: Array,
        default: [0, 0, 0]
    },
    map: {
        type: Array,
        default: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, 
    capacity: {
        type: Number,
        default: 5
    },
    army:{
        type: Number,
        default: 0
    }
});

/*----------------------
MODEL
----------------------*/
const User = mongoose.model('User', userSchema);

module.exports = User;
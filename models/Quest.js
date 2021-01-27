/*----------------------
BIND DEPENDENCIES
----------------------*/
const mongoose = require('mongoose');

/*----------------------
Schema
----------------------*/
const questSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    task:{
        type: String,
        required: true
    },
    rewardCoins:{
        type: Number,
        default: 100
    },
    requiredLvl: {
        type: Number
    }
});

/*----------------------
MODEL
----------------------*/
const Quest = mongoose.model('Quest', questSchema);

module.exports = Quest;
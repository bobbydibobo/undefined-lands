/*----------------------
BIND DEPENDENCIES
----------------------*/
const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurifier(new JSDOM().window);

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
    markdown:{
        type: String,
        required: true
    },
    solutions: {
        type: String,
        default: 'a'
    },
    requiredLvl: {
        type: Number,
        default: 1
    },
    slug: {
        type: String,
        required: true
        //unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true 
    }
});

/*----------------------
PRE-ACTIONS
----------------------*/
questSchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if(this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }

    next();
});

/*----------------------
MODEL
----------------------*/
const Quest = mongoose.model('Quest', questSchema);

module.exports = Quest;
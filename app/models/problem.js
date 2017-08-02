/*jshint esversion: 6 */
const mongoose = require('mongoose');

var Problem = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    choices: [{
        no: Number,
        choice: String 
    }],
    correctChoice: Number
});


module.exports = mongoose.model('Problem', Problem);

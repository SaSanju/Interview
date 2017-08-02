/*jshint esversion: 6 */
const mongoose = require('mongoose'),
    Problem = require('./problem'),
    Invite = require('./invite');

var Submission = new mongoose.Schema({
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    },
    invite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invite'
    },
    choice: {
        type: Number
    },
});


module.exports = mongoose.model('Submission', Submission);
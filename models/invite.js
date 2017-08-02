/*jshint esversion: 6 */
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const Submission = require('./submission');
const Problem = require('./problem');
const validators = require('./validators');

var Invite = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [validators.validateEmail, 'Please fill a valid email address'],
    },
    token: {
        type: String,
        required: true
    },
    isOpened: {
        type: Boolean,
        default: false
    }
});

Invite.pre('validate', function(next) {
    this.token = uuidv1();
    next();
});

Invite.methods.getScore = function() {
    let problemChoiceMap = {};
    var self = this;
    return new Promise((resolve, reject) => {
        Submission.find({
                invite: self._id
            })
            .then((submissions) => {
                submissions.forEach(function(submission, index) {
                    problemChoiceMap[submission.problem] = submission.choice;
                });
                return Problem.find({
                    _id: {
                        $in: Object.keys(problemChoiceMap)
                    }
                });
            })
            .then((problems) => {
                let score = 0;
                problems.forEach(function(problem, index) {
                    if (problemChoiceMap[problem._id] == problem.correctChoice) {
                        score += 1;
                    }
                });
                resolve(score);
            })
            .catch((err) => {
                console.log(err);
                resolve(0);
            });
    });

};

module.exports = mongoose.model('Invite', Invite);
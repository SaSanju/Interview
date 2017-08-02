var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var config = require('../config');
var Invite = require('../models/invite');
var Problem = require('../models/problem');
var Submission = require('../models/submission');

const utils = require('./utils');


var secretKey = config.secretKey;
const jwt = require('jsonwebtoken');



function createToken(user) {
    var token = jwt.sign({
        id: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin
    }, config.secretKey);
    return token;
}

function sessionTokenMiddleWare(req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if (!token) {
        res.status(403).json({
            message: 'Unauthenticated user'
        });
        return;
    }
    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            res.status(403).json({
                message: 'Unauthenticated user'
            });
            return;
        }
        req.decoded = decoded;
        next();
    });
}

router.post('/signup', (req, res) => {
    var user = new User(req.body);
    console.log(User);

    user.save(function (err) {
        console.log(err);
        if (err) {
            return res.send(err);
        }
        var token = createToken(user);
        res.json({
            token: token,
            message: 'user created',
            success: true
        });
    });
});


// Insert Problem API
router.post('/problem', (req, res) => {
    new Problem(req.body).save().then((ques) => {
        return res.json(ques);
    })
        .catch((err) => {
            return res.status(400).json({
                message: err,
                success: false
            });
        });
});


function onlyAdmin() {
    return function (req, res, next) {
        if (req.decoded.isAdmin) {
            next();
        } else {
            res.status(403).json({
                message: 'only Admin permitted'
            });
        }
    };
}

// Login API
router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email,
        isAdmin: true
    }, (err, user) => {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
            res.json({
                message: 'user does not exist',
                success: false
            });
            return;
        }
        var token = createToken(user);
        res.json({
            message: 'success',
            token: token,
            user: user,
            success: true
        });
    });
});

// Invitation Verification API
router.route('/verify-invitation/')
    .post((req, res) => {
        let token = req.body.invitationToken;
        let candidateEmail = req.body.email;
        Invite.findOne({
            token: token,
            email: candidateEmail
        })
            .then((invite) => {
                return new Promise((resolve, reject) => {
                    if (invite) {
                        if (invite.isOpened) {
                            invite.getScore().then((score) => {
                                resolve({
                                    score: score,
                                    problems: null,
                                    invite
                                });
                            });
                        } else {
                            Problem.find({}).limit(5).select('question choices _id').then((problems) => {
                                resolve({
                                    problems: problems,
                                    score: null,
                                    invite
                                });
                            });
                        }
                    } else {
                        reject('Not found');
                    }
                });
            })
            .then((data) => {
                return res.json({
                    problems: data.problems,
                    score: data.score,
                    inviteId: data.invite._id,
                    success: true
                });
            })
            .catch((err) => {
                return res.json({
                    message: 'Either token is invalid or candidate not permitted',
                    success: false
                });
            });
    });

// Answer Submit API
router.route('/submit-answers')
    .post((req, res) => {
        let inviteId = req.body.inviteId;
        let problemIdChoiceMap = req.body.problemIdChoiceMap;
        let invitationToken = req.body.invitationToken;
        let promises = [];
        Object.keys(problemIdChoiceMap).forEach((problemId, index) => {
            promises.push(
                Submission.create({
                    problem: problemId,
                    invite: inviteId,
                    choice: problemIdChoiceMap[problemId]
                })
            );
        });
        utils.updateInvitation(invitationToken).then((invite) => {
            Promise.all(promises)
                .then((submissions) => {
                    return res.json({
                        submissions,
                        invite: {
                            score: invite.score,
                            _id: invite._id,
                            email: invite.email,
                            token: invite.token
                        },
                        success: true
                    });
                });
        });

    });

router.use(sessionTokenMiddleWare);

// Invite API
router.route('/invite')
    .post((req, res) => {
        let inviteEmail = req.body.inviteEmail;
        let invite = new Invite({
            email: inviteEmail,
        });
        invite.save()
            .then(invite => {
                let magicLink = `http://${req.hostname}:${config.port}/invitation/${invite.token}`;
                utils.sendEmailInvite(inviteEmail, magicLink);
                return res.json({
                    message: 'invitation send.',
                    magicLink: magicLink,
                    success: true,
                    invite: invite
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    message: err
                });
            });
    })
    .get((req, res) => {
        Invite.find({}).then(invites => {
            let promises = invites.map(invite => invite.getScore());
            Promise.all(promises)
                .then((scores) => {
                    let inviteList = [];
                    for (let i = 0; i < scores.length; i++) {
                        inviteList.push({
                            email: invites[i].email,
                            isOpened: invites[i].isOpened,
                            score: scores[i]
                        });
                    }
                    return res.json({
                        message: 'invitation send',
                        success: true,
                        invites: inviteList
                    });
                });
        })
            .catch(err => res.status(400).json({
                success: false,
                message: err
            }));
    });


module.exports = router;
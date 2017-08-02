/*jshint esversion: 6 */
const Invite = require('../models/invite'),
      nodemailer = require('nodemailer'),
      config = require('../../config');

function updateInvitation(invitationToken) {
    return new Promise((resolve, reject) => {
        Invite.findOneAndUpdate({
            token: invitationToken
        }, {
            isOpened: true
        }, (err, doc) => {
            if (err) reject(err);
            doc.getScore().then((score) => {
                doc.score = score;
                resolve(doc);
            });
            
        });
    });

}

function sendEmailInvite(to, text) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: config.emailAuth
    });

    var mailOptions = {
        from: 'youremail@gmail.com',
        to: to,
        subject: 'Interview Invite',
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    updateInvitation,
    sendEmailInvite
};
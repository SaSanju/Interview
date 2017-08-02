/*jshint esversion: 6 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validators = require('./validators');

var User = new mongoose.Schema({
    userName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        validate: [validators.validateEmail, 'Please fill a valid email address'],
        index: {
            unique: true
        }
    },
    password: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

User.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

User.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

User.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
    const self = this;
    return new Promise((resolve, reject) => {
        self.findOne(condition, (err, result) => {
            if (err) {
                reject(err);
            }
            if (result) {
                resolve(result);
            } else {
                self.create(doc, (err, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(err);
                    }
                });
            }
        });
    });
};

module.exports = mongoose.model('User', User);
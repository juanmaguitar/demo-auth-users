'use strict';

var User = require('./models').User;
var debug = require('debug')('routes:user');

// POST /users
exports.signup = function (req, res) {
  req.check('email', 'Please enter a valid email').len(1).isEmail();
  req.check('password', 'Please enter a password with a length between 4 and 34 digits').len(4, 34);
  req.check('givenName', 'Please enter your first name').len(1);
  req.check('familyName', 'Please enter your last name').len(1);

  var errors = req.validationErrors();
  if (errors) {
    res.redirect('/login');
    return;
  }

  // If the form is valid create a new user
  var newUser = {
    name: {
      givenName: req.body.givenName,
      familyName: req.body.familyName
    },
    emails: [
      {
        value: req.body.email
      }
    ]
  };

  // hash password
  User.hashPassword(req.body.password, function (err, passwordHash) {
    // update attributes
    newUser.passwordHash = passwordHash;
    // Create new user
    User.create(newUser, function (err, user) {
      return res.redirect('/account');
    });
  });


};
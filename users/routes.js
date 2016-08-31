'use strict';

var User = require('./models').User;

// POST /users
exports.signup = function (req, res) {
  res.redirect('/account');
};
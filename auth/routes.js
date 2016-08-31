'use strict';

// auth/local provides routes for POST authentication.

var passport = require('passport');
var User = require('../users/models').User;
var LocalStrategy = require('passport-local').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser( (user, fn) => { fn(null, user.id) });


// deserializeUser is passed a function that will return the user the
// belongs to an id.
passport.deserializeUser( (id, fn) => {
  User.findOne( {_id: id}, (err, user) => { fn(err, user) } );
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.

passport.use(new LocalStrategy(

  // We are using email for verification so we set the name of
  // usernameField to 'email'. This allows use to post: email and
  // password
  { usernameField: 'email' },

  // This is the callback function it will be passed the email and
  // password that have been submitted.
  function (email, password, fn) {
    // We need to look up the user by email address
    User.findOne({'emails.value': email}, (err, usr) => {

      if (err) return fn(err, false, { message: 'An Error occurred' });

      // no user then an account was not found for that email address
      if (!usr) return fn(err, false, { message: 'Unknown email address ' + email });

      // If we have a user lets compare the provided password with the
      // user's passwordHash
      User.comparePasswordAndHash(password, usr.passwordHash, (err, valid) => {
        if (err) return fn(err);

        // if the password is invalid return that 'Invalid Password' to
        // the user
        if (!valid) return fn(null, false, { message: 'Invalid Password' });

        return fn(null, usr);
      });

    }); // User.findOne

  }
));


// POST */auth/local
exports.local = function (req, res, fn) {

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return fn(err);
    }
    if (!user) {
      return res.redirect('/login');
    }


    req.logIn(user, function (err) {
      if (err) {
        return fn(err);
      }
      return res.redirect('/account');
    });

  })(req, res, fn);

};
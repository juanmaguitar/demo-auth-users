'use strict';


// import the moongoose helper utilities
var utils = require('../utils');
var request = require('supertest');
var should = require('should');
var app = require('../../app');
var debug = require('debug')('routes:user:test');
var User = require('../../users/models').User;


describe('Users: routes', function () {

  describe('POST /signup', function () {

    it('should redirect to "/account" if the form is valid', function (done) {

      var post = {
        givenName: 'Barrack',
        familyName: 'Obama',
        email: 'berry@example.com',
        password: 'secret'
      };

      request(app)
        .post('/signup')
        .send(post)
        .expect(302)
        .expect('Location', '/account')
        .end(done)
    });

    it('should redirect to "/login" if the form is invalid', function (done) {

      var post = {
        givenName: 'Barrack',
        familyName: '',
        email: 'fakeemail',
        password: 'se'
      };

      request(app)
        .post('/signup')
        .send(post)
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    });

    it('should create a new User if the form is valid', function (done) {
      var post = {
        givenName: 'Barrack',
        familyName: 'Obama',
        email: 'berry@example.com',
        password: 'secret'
      };
      request(app)
        .post('/signup')
        .send(post)
        .expect(302)
        .end(function (err, res) {
          should.not.exist(err);
          User.find(function (err, users) {
            users.length.should.equal(1);
            var userTest = users[0];
            // Make sure the user values match up.
            userTest.name.givenName.should.equal(post.givenName);
            userTest.name.familyName.should.equal(post.familyName);
            userTest.emails[0].value.should.equal(post.email);
            should.exist(userTest.passwordHash);
            done();
          });
        });
    });


  });



});
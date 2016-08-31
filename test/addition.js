'use strict';

// import the moongoose helper utilities
var utils = require('./utils');
var request = require('supertest');
var should = require('should');
var app = require('../app');

describe('addition', function () {

	it('should add 1+1 correctly', (done) => {
    var onePlusOne = 1 + 1;
    onePlusOne.should.equal(2);
    done();
  });

  it('should return 2 given the url /add/1/1', function (done) {
    request(app)
      .get('/add/1/1')
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        parseFloat(res.text).should.equal(2);
        done();
      });
  });

});
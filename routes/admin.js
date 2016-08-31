'use strict';

var debug = require('debug')('admin');
// GET admin index.


exports.index = function (req, res) {
	debug(res);
  res.send("welcome to the admin");
};
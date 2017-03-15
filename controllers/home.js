/**
 * GET /
 * Home page.
 */

const User = require('../models/User');
var Promise = require('bluebird');

exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

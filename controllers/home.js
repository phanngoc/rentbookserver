/**
 * GET /
 * Home page.
 */

const User = require('../models/User');
var Promise = require('bluebird');

exports.index = (req, res) => {
  User.delete(1).then(function(result) {
    console.log(result);
  });
  // User.update(1, {email: "ads@gma.sd"}).then(function(result) {
  //   console.log(result);
  // })
  res.render('home', {
    title: 'Home'
  });
};

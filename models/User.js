const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
var Promise = require('bluebird');
const firebase = require('../config/firebase');

var User = {};

/**
 * Password hash middleware.
 */
User.create = function(user) {
  var usersRef = firebase.database().ref().child("users");
  usersRef.push().set(user);
};

User.find = function(id) {
  var usersRef = firebase.database().ref("users/" + id);
  return new Promise(function(resolve, reject) {
    usersRef.on("value", function(snapshot) {
      resolve(snapshot.val());
    }, function (errorObject) {
      resolve(errorObject);
    });
  })
};

User.all = function() {
  var usersRef = firebase.database().ref("users/");
  return new Promise(function(resolve, reject) {
    usersRef.on("value", function(snapshot) {
      resolve(snapshot.val());
    }, function (errorObject) {
      resolve(errorObject);
    });
  })
};

User.update = function(id, params) {
  var usersRef = firebase.database().ref("users/" + id);
  return new Promise(function(resolve, reject) {
    usersRef.update(params).then(function(error) {
      reject(error);
    });
    resolve({status: 1});
  })
};

User.delete = function(id) {
  var usersRef = firebase.database().ref("users/" + id);
  return new Promise(function(resolve, reject) {
    usersRef.remove().then(function(error) {
      reject(error);
    });
    resolve({status: 1});
  })
}

User.delete_all = function(isAnchor = false) {
  var usersRef = firebase.database().ref("users");
  return new Promise(function(resolve, reject) {
    usersRef.remove().then(function(error) {
      reject(error);
    });
    resolve({status: 1});
  })
}

module.exports = User;

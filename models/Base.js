var Promise = require('bluebird');
const firebase = require('../config/firebase');
const querybase = require('querybase');
const _ = require('underscore');

function Base(model) {
  this.model = model;
};

function removeKeys(results) {
  var keys = _.keys(results);
  var objArr = _.map(keys, function(key){
    return results[key];
  });
  return objArr;
}

Base.prototype.createWithKey = function(user, key) {
  var objRef = firebase.database().ref(this.model + "/" + key);
  return new Promise(function(resolve, reject) {
    resolve(objRef.set(user));
  })
};

Base.prototype.create = function(user) {
  var objRef = firebase.database().ref().child(this.model);
  return new Promise(function(resolve, reject) {
    resolve(objRef.push(user).key);
  })
};

Base.prototype.find = function(id) {
  var objRef = firebase.database().ref(this.model + "/" + id);
  return new Promise(function(resolve, reject) {
    objRef.on("value", function(snapshot) {
      resolve(snapshot.val());
    }, function (errorObject) {
      resolve(errorObject);
    });
  })
};

Base.prototype.all = function(withKey = false) {
  var objRef = firebase.database().ref(this.model + "/");
  return new Promise(function(resolve, reject) {
    objRef.on("value", function(snapshot) {
      if (withKey) {
        resolve(snapshot.val());
      } else {
        resolve(removeKeys(snapshot.val()));
      }
    }, function (errorObject) {
      resolve(errorObject);
    });
  })
};

Base.prototype.update = function(id, params) {
  var objRef = firebase.database().ref(this.model + "/" + id);
  return new Promise(function(resolve, reject) {
    objRef.update(params).then(function(error) {
      reject(error);
    });
    resolve({status: 1});
  })
};

Base.prototype.delete = function(id) {
  var objRef = firebase.database().ref(this.model + "/" + id);
  return new Promise(function(resolve, reject) {
    objRef.remove().then(function(error) {
      reject(error);
    });
    resolve({status: 1});
  })
}

Base.prototype.delete_all = function(isAnchor = false) {
  var objRef = firebase.database().ref(this.model);
  return new Promise(function(resolve, reject) {
    objRef.remove().then(function(error) {
      reject(error);
    });
    resolve({status: 1});
  })
}

Base.prototype.findOne = function(conditions, withKey = false) {
  var objRef = firebase.database().ref(this.model);
  var index = _.keys(conditions);

  var querybaseRef = querybase.ref(objRef, index);

  return new Promise(function(resolve, reject) {
    const queriedDbRef = querybaseRef
      .where(conditions);
      queriedDbRef.on('value', function(snap) {
          if (withKey) {
            resolve(snap.val());
          } else {
            resolve(snap.val()[Object.keys(snap.val())[0]]);
          }
      });
  });
};

module.exports = Base;

const Book = require('../models/Book');
const User = require('../models/User');
const Position = require('../models/Position');
const _ = require('underscore');
const async = require('async');

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

exports.trending = (req, res) => {

};

exports.nearest = (req, res) => {
  var lat = req.body.lat;
  var lng = req.body.lng;

  User.all(true).then(function(results) {
    async.mapSeries(_.keys(results), function(key, callback) {
      Position.find(key).then(function(pos) {
        var obj = {_id: key, pos: pos};
        callback(null, obj);
      });
    }, function(err, arrPos) {
      _.sortBy(arrPos, function(pos, keypos) {
          var distanceMin = 10000;
          _.each(pos.pos, function(po, keypo) {
            var distance = getDistanceFromLatLonInKm(lat, lng, po.lat, po.lng);
            if (distance < distanceMin) {
              distanceMin = distance;
            }
          })
          return distanceMin;
      });
      res.json(arrPos);
    });

  });
};

const faker = require('faker');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.table('locations').del()
   .then(function() {
     // Inserts seed entries
     var locationsPromises = [];
     for (i in _.range(1, 11)) {
       let location = knex.table('locations').insert([
         {
           user_id: _.sample(_.range(1, 11)),
           lat: faker.address.latitude(),
           lng: faker.address.longitude()
         },
       ]);
       locationsPromises.push(location);
     }
     return Promise.all(locationsPromises);
   });
};

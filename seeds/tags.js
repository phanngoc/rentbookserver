const faker = require('faker');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.table('tags').del()
   .then(function() {
     // Inserts seed entries
     var tagsPromises = [];
     for (i in _.range(10)) {
       console.log("running");
       let tag = knex.table('tags').insert([
         {
           name: faker.lorem.word(),
         },
       ]);
       tagsPromises.push(tag);
     }
     return Promise.all(tagsPromises);
   });
};

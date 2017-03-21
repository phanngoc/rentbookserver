const faker = require('faker');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.table('books').del()
   .then(function() {
     // Inserts seed entries
     var booksPromises = [];
     for (i in _.range(1, 11)) {
       console.log("running");
       let book = knex.table('books').insert([
         {
           id: i,
           title: faker.lorem.words(),
           description: faker.lorem.words(),
           user_id: _.sample(_.range(1, 11))
         },
       ]);
       booksPromises.push(book);
     }
     return Promise.all(booksPromises);
   });
};

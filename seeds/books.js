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
     for (i in _.range(10)) {
       console.log("running");
       let book = knex.table('books').insert([
         {
           title: faker.lorem.words(),
           description: faker.lorem.words()
         },
       ]);
       booksPromises.push(book);
     }
     return Promise.all(booksPromises);
   });
};

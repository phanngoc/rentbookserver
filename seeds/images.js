const faker = require('faker');
const async = require('async');
const _ = require('underscore');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.table('images').del()
   .then(function() {
     // Inserts seed entries
     var imagesPromises = [];
     for (i in _.range(1, 11)) {
       console.log("running images");
       let tag = knex.table('images').insert([
         {
           book_id: _.sample(_.range(1, 11)),
           name: faker.image.image(),
           link: faker.image.imageUrl()
         },
       ]);
       imagesPromises.push(tag);
     }
     return Promise.all(imagesPromises);
   });
};

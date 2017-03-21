const faker = require('faker');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.schema.raw("set schema 'rentbook';").then(function() {
    console.log("running");
    return knex.table('users').del()
     .then(function() {
       // Inserts seed entries
       var userPromises = [];
       for (i in _.range(1, 11)) {
         console.log("running users");
         let user = knex.table('users').insert([
           {
             id: i,
             name: faker.name.findName(),
             email: faker.internet.email(),
             username: faker.internet.userName(),
             avatar: faker.image.avatar(),
             phone: faker.phone.phoneNumber(),
             password: bcrypt.hashSync("123456")
           },
         ]);
         userPromises.push(user);
       }
       return Promise.all(userPromises);
     });
  });
};

const faker = require('faker');
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  console.log(knex);

  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      for (i in _.range(10)) {
        knex('users').insert([
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
      }
    });
};




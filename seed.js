const User = require('./models/User');
const Book = require('./models/Book');
const Image = require('./models/Image');
const Position = require('./models/Position');
const Comment = require('./models/Comment');

var faker = require('faker');
var bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

User.delete_all();
Book.delete_all();
Image.delete_all();
Position.delete_all();

var AsyncUser = {
  create: function(num, callback) {
    var user = {name: faker.name.findName(),
                  email: faker.internet.email(),
                  username: faker.internet.userName(),
                  avatar: faker.image.avatar(),
                  phone: faker.phone.phoneNumber(),
                  password: bcrypt.hashSync("123456")
                }
    User.create(user).then(function(result) {
      callback(null, result);
    });
  }
}

async.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], AsyncUser.create, function(err, results) {
  _.each(results, function(value, key) {
      var pos =
      {
        pos1: {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
        },
        pos2: {
          lat: faker.address.latitude(),
          lng: faker.address.longitude()
        }
      }
      Position.createWithKey(pos, value);
  });
});


var AsyncImage = {
  create: function(num, callback) {
    var image = {
      link: faker.image.avatar(),
    }
    Image.create(image).then(function(result) {
      callback(null, result);
    });
  }
}

async.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], AsyncImage.create, function(err, results) {
  _.each(results, function(value, key) {
      var book = {title: faker.lorem.paragraph().substring(1, 18),
        description: faker.lorem.paragraph(),
        thumbnail: {}
      }
      book["thumbnail"][value] = true
      Book.create(book);
  });
});

const User = require('./models/User');
const Book = require('./models/Book');
const Image = require('./models/Image');

var faker = require('faker');
var bcrypt = require('bcrypt-nodejs');
const async = require('async');
const _ = require('underscore');

User.delete_all();
Book.delete_all();
Image.delete_all();

for (i = 1; i < 10; i++) {
  var user = {name: faker.name.findName(),
                  email: faker.internet.email(),
                  username: faker.internet.userName(),
                  avatar: faker.image.avatar(),
                  phone: faker.phone.phoneNumber(),
                  password: bcrypt.hashSync("123456")
                }
  User.create(user);
}

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

async.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], AsyncImage.create, function(err, results)
  _.each(results, function(value, key) {
      var book = {title: faker.lorem.paragraph().substring(1, 18),
        description: faker.lorem.paragraph(),
        thumbnail: {}
      }
      book["thumbnail"][value] = true
      Book.create(book);
  });
});

const User = require('./models/User');
var faker = require('faker');


for (i = 1; i < 10; i++) {
  var params = {id: i, name: faker.name.findName(),
                  email: faker.internet.email(),
                  avatar: faker.image.avatar(),
                  phone: faker.phone.phoneNumber()
                }
  User.create(params);
}

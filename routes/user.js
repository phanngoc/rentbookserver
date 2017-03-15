module.exports = function(app) {
  var user = app.controllers.user;
  app.get('/api/users', user.allUser);
};

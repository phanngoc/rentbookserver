module.exports = function(app) {
  var user = app.controllers.UserController;
  app.get('/api/users', function(req, res) {
    let userObj = new user.default(req, res);
    userObj.allUsers();
  });
};

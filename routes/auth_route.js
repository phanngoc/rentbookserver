module.exports = function(app) {
  var auth = app.controllers.AuthController;
  app.post('/api/authenticate', function(req, res) {
    let authInstance = new auth(req, res);
    return authInstance.authenticate();
  });
};

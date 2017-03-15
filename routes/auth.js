module.exports = function(app) {
  var auth = app.controllers.auth;
  app.post('/api/authenticate', auth.authenticate);
};

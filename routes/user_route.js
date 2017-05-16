import upload from "../config/upload"

module.exports = function(app) {
  var user = app.controllers.UserController;
  app.get("/api/users", function(req, res) {
    let userObj = new user.default(req, res);
    userObj.allUsers();
  });

  app.post("/api/users", upload.single("avatar"), function(req, res) {
    let userObj = new user.default(req, res);
    userObj.create();
  });

  app.post("/api/users/update-token", function(req, res) {
    let userObj = new user.default(req, res);
    userObj.updateToken();
  });


  app.get("/api/users/:id/books", function(req, res) {
    let userObj = new user.default(req, res);
    userObj.show();
  });

  app.get("/api/users/myprofile", function(req, res) {
    let userObj = new user.default(req, res);
    userObj.myProfile();
  });

  app.post("/api/users/sign-out", function(req, res) {
    let userObj = new user.default(req, res);
    userObj.signOut();
  });
};

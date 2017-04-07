import upload from "../config/upload"

module.exports = function(app) {
  var thread = app.controllers.ThreadController;
  app.get("/api/threads", function(req, res) {
    let threadObj = new thread.default(req, res);
    threadObj.index();
  });

};

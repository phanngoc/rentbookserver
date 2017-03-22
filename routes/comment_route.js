import upload from "../config/upload"

module.exports = function(app) {
  var comment = app.controllers.CommentController;
  app.post("/api/books/:book_id/comments", function(req, res) {
    let commentObj = new comment.default(req, res);
    commentObj.create();
  });

  app.put("/api/books/:book_id/comments/:id", function(req, res) {
    let commentObj = new comment.default(req, res);
    commentObj.update();
  });

  app.delete("/api/books/:book_id/comments/:id", function(req, res) {
    let commentObj = new comment.default(req, res);
    commentObj.destroy();
  });
};

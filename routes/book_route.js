module.exports = function(app) {
  var book = app.controllers.BookController;
  app.get('/api/books/nearest', function(req, res) {
    let bookInstance = new book(req, res);
    return bookInstance.nearest();
  });
};

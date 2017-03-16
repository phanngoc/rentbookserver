module.exports = function(app) {
  var book = app.controllers.bookController;
  app.get('/api/books/nearest', book.nearest);
};

import upload from '../config/upload'

module.exports = function(app) {
  var book = app.controllers.BookController;
  app.get('/api/books/nearest', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.nearest();
  });
  app.get('/api/books/:id', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.show();
  });
  app.post('/api/books', upload.array('images', 12), function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.create();
  });
  app.post('/api/books/:id', upload.array('images', 12), function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.update();
  });
};

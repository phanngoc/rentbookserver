import upload from '../config/upload'

module.exports = function(app) {
  var book = app.controllers.BookController;

  app.get('/api/books/nearest', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.nearest();
  });

  app.get('/api/books/:id(\\d+)', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.show();
  });

  app.post('/api/books', upload.array('images', 12), function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.create();
  });

  app.post('/api/books/:id(\\d+)', upload.array('images', 12), function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.update();
  });

  app.post('/api/books/:id(\\d+)/borrow', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.borrow();
  });

  app.post('/api/books/:book_id(\\d+)/accept/:id(\\d+)', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.accept();
  });

  app.post('/api/books/:book_id(\\d+)/return/:id(\\d+)', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.reback();
  });

  app.get('/api/books/search', function(req, res) {
    let bookInstance = new book.default(req, res);
    bookInstance.search();
  });
};

'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('comments', {
    id: { type: 'int', primaryKey: true },
    content: 'string',
    user_id: 'int',
    book_id: 'int'
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('comments', callback)
};

exports._meta = {
  "version": 1
};

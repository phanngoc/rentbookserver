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
  db.createTable('book_tags', {
    id: { type: 'int', primaryKey: true },
    book_id: 'int',
    tag_id: 'int',
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('book_tags', callback)
};

exports._meta = {
  "version": 1
};

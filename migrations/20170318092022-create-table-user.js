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
  db.createTable('users', {
    id: { type: 'int', primaryKey: true },
    name: 'string',
    email: 'string',
    avatar: 'string',
    phone: 'integer',
    username: 'string',
    password: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('users', callback)
};

exports._meta = {
  "version": 1
};

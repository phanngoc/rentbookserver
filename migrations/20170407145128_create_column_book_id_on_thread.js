
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').table('threads', function (table) {
    table.integer('book_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').table('threads', function (table) {
    table.dropColumn('book_id');
  });
};

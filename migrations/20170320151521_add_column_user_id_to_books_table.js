
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').table('books', function (table) {
    table.integer('user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').table('books', function (table) {
    table.dropColumn('user_id');
  });
};

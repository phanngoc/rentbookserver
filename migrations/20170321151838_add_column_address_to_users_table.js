
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').table('users', function (table) {
    table.string('address');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').table('users', function (table) {
    table.dropColumn('address');
  });
};

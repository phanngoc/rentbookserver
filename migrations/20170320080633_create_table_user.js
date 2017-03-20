
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('users', function (table) {
    table.increments();
    table.string('name');
    table.string('email');
    table.string('avatar');
    table.string('username');
    table.string('password');
    table.string('phone');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('users');
};

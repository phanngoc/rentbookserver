
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('books', function (table) {
    table.increments();
    table.string('title');
    table.string('description');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('books');
};

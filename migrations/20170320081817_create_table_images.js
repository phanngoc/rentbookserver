
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('images', function (table) {
    table.increments();
    table.string('name');
    table.string('link');
    table.integer('book_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('images');
};


exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('book_tags', function (table) {
    table.increments();
    table.integer('book_id');
    table.integer('tag_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('book_tags');
};

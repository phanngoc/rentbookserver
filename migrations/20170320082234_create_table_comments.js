
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('comments', function (table) {
    table.increments();
    table.integer('user_id');
    table.integer('book_id');
    table.integer('content');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('comments');
};

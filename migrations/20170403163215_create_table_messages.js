
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('messages', function (table) {
    table.increments();
    table.integer('thread_id');
    table.string('content');
    table.integer('user_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('messages');
};


exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('notification_details', function (table) {
    table.increments();
    table.integer('notification_id');
    table.integer('message_id');
    table.integer('status');
    table.integer('user_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('notification_details');
};

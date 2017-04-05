
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('notifications', function (table) {
    table.increments();
    table.integer('noti_type');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('notifications');
};

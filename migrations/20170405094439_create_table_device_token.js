
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('device_tokens', function (table) {
    table.increments();
    table.string('token');
    table.integer('user_id');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('device_tokens');
};

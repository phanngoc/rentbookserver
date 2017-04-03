
exports.up = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').createTable('threads', function (table) {
    table.increments();
    table.integer('member_one');
    table.integer('member_two');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.withSchema('rentbook').dropTableIfExists('threads');
};

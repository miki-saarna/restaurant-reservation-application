
exports.up = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
      table.string('last_name').notNullable().alter();
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('reservations', (table) => {
      table.string('last_name').nullable().alter();
  })
};

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.dropColumn('email');
    table.text('username').unique().notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.string('email');
    table.dropColumn('username');
  });
};

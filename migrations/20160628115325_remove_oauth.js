exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.dropColumn('oauth');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.string("oauth");
  });
};

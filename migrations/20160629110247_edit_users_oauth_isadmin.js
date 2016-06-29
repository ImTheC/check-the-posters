
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.renameColumn('isAdmin', 'isadmin');
    table.renameColumn('oauthID', 'oauthid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.renameColumn('isadmin', 'isAdmin');
    table.renameColumn('oauthid', 'oauthID');
  });
};

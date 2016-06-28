exports.up = function (knex, Promise) {
	return knex.schema.createTable("users", function (table) {
		table.increments("id").primary();
		table.string("name");
		table.string("email");
		table.string("password");
		table.boolean('isAdmin').defaultTo(false);
		table.string("oauth");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable('users');
};

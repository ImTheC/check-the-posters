exports.up = function (knex, Promise) {
	return knex.schema.createTable("hearts", function (table) {
		table.increments("id").primary();
		table.integer("user_id").unsigned().index().references("users.id").onDelete('cascade');
		table.integer("poster_id").unsigned().index().references("posters.id").onDelete('cascade');
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable('hearts');
};

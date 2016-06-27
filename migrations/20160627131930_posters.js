exports.up = function (knex, Promise) {
	return knex.schema.createTable("posters", function (table) {
		table.increments("id").primary();
		table.text("imgurl");
		table.string("name");
		table.string("address");
		table.string("city_state");
		table.string("zip");
		table.date("date");
		table.time("start_time");
		table.time("end_time");
		table.string("category");
		table.string("details");
		table.integer("hearts");
		table.integer("user_id").unsigned().index().references("users.id").onDelete('cascade');
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable('posters');
};

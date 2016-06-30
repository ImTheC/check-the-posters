
exports.up = function (knex, Promise) {
	return knex.schema.table("posters", function (table) {
		table.string("date");
		table.string("start_time");
		table.string("end_time");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table('posters', function (table) {
		table.dropColumn("date");
		table.dropColumn("start_time");
		table.dropColumn("end_time");
	});
};

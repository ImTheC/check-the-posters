
exports.up = function (knex, Promise) {
	return knex.schema.table("posters", function (table) {
		table.dropColumn("date");
		table.dropColumn("start_time");
		table.dropColumn("end_time");
		table.dateTime("starting");
		table.dateTime("ending");
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table('posters', function (table) {
		table.date("date");
		table.time("start_time");
		table.time("end_time");
		table.dropColumn("starting");
		table.dropColumn("ending");
	});
};

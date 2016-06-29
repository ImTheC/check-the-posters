

exports.up = function (knex, Promise) {
	return knex.schema.table("posters", function (table) {
		table.renameColumn('city_state', 'city');
    table.string('state');

	});
};

exports.down = function (knex, Promise) {
	return knex.schema.table('posters', function (table) {
    table.renameColumn('city', 'city_state');
    table.dropColumn('state');
	});
};

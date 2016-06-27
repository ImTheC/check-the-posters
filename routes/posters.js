var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var Posters = function () {
	return knex('posters');
};

/* GET posters listing. */
router.get('/', function (req, res) {
	res.render('index', {title: "Poster Pole Front Page Home"});
});

module.exports = router;

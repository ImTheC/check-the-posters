var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var Posters = function () {
	return knex('posters');
};

/* GET posters listing. */
router.get('/', function (req, res) {
	Posters().then(function(posters){
		res.render('posters/index', {title: "Poster Pole Front Page Home", posters:posters });
	});
});

router.get('/:poster_id', function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(posters){
		res.render('posters/show', {title: "Poster Pole Front Page Home", poster:poster });
	});
});

module.exports = router;

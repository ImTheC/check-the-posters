var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var Posters = function () {
	return knex('posters');
};

/* GET posters listing. */
router.get('/', function (req, res, next) {
	res.send('respond with set of posters');
});

module.exports = router;

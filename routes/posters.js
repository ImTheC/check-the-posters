var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var Posters = function () {
	return knex('posters');
};

var loggedIn = function(req, res, next) {
	var user_id = req.signedCookies.userID;

	if ( user_id ) {
		next();
	} else {
		res.status(401).redirect('/');
	}
};

var authorized = function(req, res, next) {
	var user_id = req.signedCookies.userID;

	if ( user_id === req.params.id ) {
		next();
	} else {
		res.status(401).redirect('/');
	}
};


/* GET All POSTERS.
					&
	ADD NEW POSTERS. */

router.route('/')

	.get(function (req, res) {
		Posters().then(function(posters){
			res.render('posters/index', {title: "Poster Pole Front Page", posters:posters });
		})

	.post(function(req, res){
		res.send("This would have been added " + req.body.comment);
		// knex("posters").insert(req.body.poster).then(function(){
		// 	res.redirect("/" + req.params.poster.id);
		// });
	});

/* CREATE NEW POSTERS. */
router.get('/new', loggedIn, function (req, res) {
	res.render('posters/new', {title: "New Poster"});
});

/* GET SPECIFIC POSTER */
router.get('/:poster_id', function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(poster){
		res.render('posters/show', {title: "Poster Page", poster:poster });
	});
});


/* EDIT PAGE FOR SPECIFIC POSTER */
router.get('/:poster_id/edit', function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(poster){
		res.render('posters/edit', {title: "Poster Page", poster:poster });
	});
});


/* DELETE OR EDIT POSTER */
router.route('/:poster_id', authorized)

	.delete(function(req, res){
		res.send('This would have been DELETED!');
		// Posters().where('id', req.params.poster_id).delete().then(function(){
		// 	res.redirect('/');
		// });
	})

	.put(function(req, res){
		res.send('This would edit with the following values ' + req.body.poster);
		// Posters().where('id', req.params.poster_id).update(req.body.poster).then(function(){
		// 	res.redirect('posters/' + req.params.poster_id);
		// });
	});

module.exports = router;

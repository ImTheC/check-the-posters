var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var authHelpers = require('../auth/authHelpers');
var passwordHelpers = require('../auth/passwordHelpers');

router.use(authHelpers.currentUser);
// router.use(authHelpers.checkAuthentication);

var Posters = function () {
	return knex('posters');
};

var Hearts = function () {
	return knex('hearts');
};

/* GET All POSTERS.
					&
	ADD NEW POSTERS. */
router.route('/')

	.get(function (req, res) {
		var today = new Date();
			Posters().where('ending', '>', today).orderBy('starting', 'asc').then(function(posters){
				res.render('posters/index', {title: "Poster Pole Front Page", posters:posters, today: today});
			});
	})

	.post(function(req, res){
		eval(locus);
		req.body.poster.starting = req.body.date + "T" + req.body.poster.starting;
		req.body.poster.ending = req.body.date + "T" + req.body.poster.ending;
		req.body.poster.user_id = req.user.id;


		knex("posters").insert(req.body.poster, "id").then(function(id){
			res.redirect("/posters/" + id);
		});
	});

router.route('/:poster_id/heart')

	.put(function (req, res) {
		// var user_id = {{COOKIE}} // NEEDS USER COOKIE INFO
		var user_id = 1;  // NEEDS TO BE REMOVED ONCE USER COOKIE INFO IS IN PLACE
		var hearted = false;
		var heartsIndex;


		Hearts().where("poster_id",  req.params.poster_id).then(function(usersHearted) {
			usersHearted.forEach(function(heart){
				if (heart.user_id === user_id) {
					hearted = true;
					heartsIndex = heart.id;
				} else {
					hearted = false;
				}
			});

			if (hearted) {   // If user has already hearted then -1 to heart and delete hearted entry
				Posters().where("id", req.params.poster_id).select("hearts").first().then(function(hearts){
					Posters().where("id", req.params.poster_id).decrement('hearts', 1).then(function(){
						Hearts().where("id", heartsIndex).del().then(function(){
							res.send("minus");
						});
					});
				});
			} else {     // Else user hasn't already hearted, add it
				Posters().where("id", req.params.poster_id).select("hearts").first().then(function(hearts){
					Posters().where("id", req.params.poster_id).increment('hearts', 1).then(function(){
						Hearts().where("id", heartsIndex).insert({user_id: user_id, poster_id: req.params.poster_id}).then(function(){
							res.send("plus");
						});
					});
				});
			}
		});
	});

/* CREATE NEW POSTERS PAGE. */
router.get('/new', authHelpers.checkAuthentication, function (req, res) {
	res.render('posters/new', {title: "New Poster"});
});

/* GET SPECIFIC POSTER PAGE*/
router.get('/:poster_id', function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(poster){
		res.render('posters/show', {title: "Poster Page", poster:poster });
	});
});


/* EDIT PAGE FOR SPECIFIC POSTER */
router.get('/:poster_id/edit', authHelpers.checkAuthentication, function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(poster){
		if (req.user.id === poster.user_id) {
			res.render('posters/edit', {title: "Poster Page", poster:poster });
		} else {
			res.redirect('/');
		}
	});
});


/* DELETE OR EDIT POSTER */
router.route('/:poster_id', authHelpers.checkAuthentication)

	.delete(function(req, res){
		res.send('This would have been DELETED!');
		// Posters().where('id', req.params.poster_id).delete().then(function(){
		// 	res.redirect('/');gi
		// });
	})

	.put(function(req, res){
		res.send('This would edit with the following values ' + req.body.poster);
		// Posters().where('id', req.params.poster_id).update(req.body.poster).then(function(){
		// 	res.redirect('posters/' + req.params.poster_id);
		// });
	});

module.exports = router;

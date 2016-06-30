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

var standardTime = function(time){
	time = time.split(':'); // convert to array

	// fetch
	var hours = Number(time[0]);
	var minutes = Number(time[1]);

	// calculate
	var timeValue = "" + ((hours >12) ? hours - 12 : hours);  // get hours
	timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
	timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

	return timeValue;
};

var formatDate = function(oldDate) {
	var newDate = oldDate.split(" ");
	if ( newDate.length > 1 ) {
		// Turn Month Abbreviation Into Number
		var month = new Date(Date.parse(newDate[0] +"01, 2012")).getMonth()+1;
		// Give Month Two Digit Format
		month = (month).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
		var day = newDate[1].split(",")[0];
		var year = newDate[2];
		newdate = year + "-" + month + "-" + day;
		return newdate;
	} else {
		return oldDate;
	}
};


/* GET All POSTERS.
					&
	ADD NEW POSTERS. */
router.route('/')

	.get(function (req, res) {
		var today = new Date();
			Posters().where('ending', '>', today).orderBy('starting', 'asc').then(function(posters){
				// res.render('post', {title: "Maps!"});
				res.render('posters/index', {title: "Poster Pole Front Page", posters:posters, today: today});
			});
	})

	.post(function(req, res){
		req.body.poster.starting = req.body.poster.date + "T" + req.body.poster.start_time;
		req.body.poster.ending = req.body.poster.date + "T" + req.body.poster.end_time;
		req.body.poster.user_id = req.user.id;
		req.body.poster.date = formatDate(req.body.poster.date);

		knex("posters").insert(req.body.poster, "id").then(function(id){
			res.redirect("/posters/" + id);
		});
	});

router.route('/:poster_id/heart')

	.put(authHelpers.checkAuthentication, function (req, res) {
		var user_id = res.locals.currentUser.id;
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
	if ( isNaN(req.params.poster_id) ) {
		res.redirect("/");
	} else {
		Posters().where("id", req.params.poster_id).first().then(function(poster){
			poster.start_time = standardTime(poster.start_time); // change military time to standard
			poster.end_time = standardTime(poster.end_time);
			res.render('posters/show', {title: "Poster Page", poster:poster});
		});
	}
});


/* EDIT PAGE FOR SPECIFIC POSTER */
router.get('/:poster_id/edit', authHelpers.checkAuthentication, function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(poster){
		formatDate(poster.date);
		if (req.user.id === poster.user_id) {
			res.render('posters/edit', {title: "Edit Poster", poster:poster });
		} else {
			res.redirect('/');
		}
	});
});


/* DELETE OR EDIT POSTER */
router.route('/:poster_id', authHelpers.checkAuthentication)

	.delete(function(req, res){
		Posters().where('id', req.params.poster_id).delete().then(function(){
			res.status(200).send(true);
		});
	})

	.put(function(req, res){
		req.body.poster.starting = req.body.poster.date + "T" + req.body.poster.start_time;
		req.body.poster.ending = req.body.poster.date + "T" + req.body.poster.end_time;
		req.body.poster.id = req.params.poster_id;
		req.body.poster.date = formatDate(req.body.poster.date);

		Posters().where('id', req.body.poster.id).update(req.body.poster).then(function(){
			res.redirect('/' + req.params.poster_id);
		});
	});

module.exports = router;

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

var dateDisplay = function(oldDate){   // change date to typical U.S. display format
	oldDate = (new Date(oldDate)).toString().split(" ");

	var month = oldDate[1];
	var day = Number(oldDate[2]);
	var year = Number(oldDate[3]);

	return month + " " + day + ", " + year;
};

var formatDate = function(oldDate) {  // change to correct date format for time value input, like on edit page
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

	.get(function (req, res) {   // ##### GET All POSTERS #####
		var today = new Date();
		var endOfThisWeek = new Date();
		var endOfNextWeek = new Date();
		endOfThisWeek.setHours(0,0,0,0);
		endOfNextWeek.setHours(0,0,0,0);

		var i = 0;

		do {   // Find next Monday
			i++;
			endOfThisWeek.setDate(today.getDate()+i);
		} while (endOfThisWeek.toString().split(" ")[0] != "Mon");

		endOfNextWeek.setDate(endOfThisWeek.getDate()+7);  // A week from next Monday

		Posters().orderBy('starting', 'asc').then(function(posters){
			var thisWeeksPosters = [];
			var nextWeeksPosters = [];
			var futurePosters = [];
			var thisWeeksDemo = false;
			var nextWeeksDemo = false;
			var futureWeeksDemo = false;

			for ( var i = 0; i < posters.length; i++ ) {  // Sort posters by this week, next week, and beyond
				if ( posters[i].ending > today && posters[i].starting < endOfThisWeek ) {
					thisWeeksPosters.push(posters[i]);
				} else if ( posters[i].starting > endOfThisWeek && posters[i].starting < endOfNextWeek ) {
					nextWeeksPosters.push(posters[i]);
				} else if ( posters[i].starting > endOfNextWeek){
					futurePosters.push(posters[i]);
				}
			}

			if ( thisWeeksPosters.length === 0 ) {  // if no posters add in examples
				thisWeeksDemo = true;
				for ( var j = 0; j < 4; j++ ) {
					thisWeeksPosters.push(posters[j]);
				}
			}

			if ( nextWeeksPosters.length === 0 ) {  // if no posters add in examples
				nextWeeksDemo = true;
				for ( var k = 4; k < 6; k++ ) {
					thisWeeksPosters.push(posters[k]);
				}
			}

			if ( futurePosters.length === 0 ) {  // if no posters add in examples
				futureWeeksDemo = true;
				for ( var l = 6; l < 8; l++ ) {
					futurePosters.push(posters[l]);
				}
			}

			res.render('posters/index', {title: "Poster Pole Front Page", thisWeeksPosters: thisWeeksPosters, nextWeeksPosters: nextWeeksPosters, futurePosters: futurePosters, today: today, thisWeeksDemo: thisWeeksDemo, nextWeeksDemo: nextWeeksDemo, futureWeeksDemo: futureWeeksDemo, user: req.user});
		});
	})

	.post(function(req, res){  // ##### ADD NEW POSTERS #####
		if ( req.body.start_AMPM === "PM" ) {
			req.body.poster.start_time = (parseInt(req.body.start_hour) + 12).toString() + ":" + req.body.start_minute + ":00";
		} else {
			req.body.poster.start_time = req.body.start_hour + ":" + req.body.start_minute + ":00";
		}
		if ( req.body.end_AMPM === "PM" ) {
			req.body.poster.end_time = (parseInt(req.body.end_hour) + 12).toString() + ":" + req.body.end_minute + ":00";
		} else {
			req.body.poster.end_time = req.body.end_hour + ":" + req.body.end_minute + ":00";
		}
		req.body.poster.starting = req.body.poster.date + "T" + req.body.poster.start_time;
		req.body.poster.ending = req.body.poster.date + "T" + req.body.poster.end_time;
		req.body.poster.user_id = req.user.id;
		req.body.poster.date = dateDisplay(req.body.poster.date);

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
	var authorized = false;
	if ( isNaN(req.params.poster_id) ) {
		res.redirect("/");
	} else {
		Posters().where("id", req.params.poster_id).first().then(function(poster){
			poster.start_time = standardTime(poster.start_time); // change military time to standard
			poster.end_time = standardTime(poster.end_time);
			poster.date = dateDisplay(poster.date); // change date to typical U.S. display format

			if ( req.user && req.user.id === poster.user_id ) {   // Check if authorized
				authorized = true;
			} else {
				authorized = false;
			}

			res.render('posters/show', {title: "Poster Page", poster:poster, authorized: authorized});
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
		Posters().where('id', req.params.poster_id).first().then(function(poster){
			if ( poster.user_id === req.user.id ) {
				Posters().where('id', req.params.poster_id).delete().then(function(){
					res.status(200).send(true);
				});
			} else {
				res.flash('error', "Not Authorized");
				res.send(401).redirect('/');
			}
		});
	})

	.put(function(req, res){
		Posters().where('id', req.params.poster_id).first().then(function(poster){
			if ( poster.user_id === req.user.id ) {
				req.body.poster.starting = req.body.poster.date + "T" + req.body.poster.start_time;
				req.body.poster.ending = req.body.poster.date + "T" + req.body.poster.end_time;
				req.body.poster.id = req.params.poster_id;
				req.body.poster.date = formatDate(req.body.poster.date);

				Posters().where('id', req.body.poster.id).update(req.body.poster).then(function(){
					res.redirect('/' + req.params.poster_id);
				});
			} else {
				res.flash('error', "Not Authorized");
				res.send(401).redirect('/');
			}
		});
	});

module.exports = router;

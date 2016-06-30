var passport = require('passport');
var TwitterStrategy = require('passport-twitter');
var knex = require("../db/knex");

var init = require('./init');

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.HOST + "/auth/twitter/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    // update the user if s/he exists or add a new user
    knex('users').where('username', profile.username).first().then((user) =>{
      if (user) {
        done(null, user);
      } else {
        knex('users').insert({
          name: profile.displayName,
          username: profile.username,
          oauthid: profile.id
        }, "id").then((user) => {
          done(null, user);
          })
        }
    })
  }
))

// serialize user into the session
init();

module.exports = passport;

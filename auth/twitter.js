var passport = require('passport');
var TwitterStrategy = require('passport-twitter');

var init = require('./init');

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.HOST + "/auth/twitter/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    var name = profile.displayName;
    var username = profile.userName;
    var oauthID = profile.userId;

    // update the user if s/he exists or add a new user
    knex('users').where({ oauthid }).first().then((user) =>{
      if (!user) {
        // Knex create up user here.
      }
      return done(null, user);
    }).catch((err) => {
      return done(err)
    })
  }
));

// serialize user into the session
init();

module.exports = passport;

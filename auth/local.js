"use strict";
var passport = require('passport');
var LocalStrategy = require('passport-local');
var knex = require("../db/knex");
var passwordHelpers = require('./passwordHelpers');

var init = require('./init');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
  passReqToCallback : true
},(req, username, password, done) =>{
    knex('users').where({ username }).first().then((user) =>{
      if (!user) {
        return done(null, false, req.flash('loginMessage','Wrong credentials'));
      }
      if (!passwordHelpers.comparePass(password, user.password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong credentials'));
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

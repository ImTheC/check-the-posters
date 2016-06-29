var passport = require('passport');
var knex = require('../db/knex');

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    knex('users').where({id}).first().then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err,null);
    })
  })

};

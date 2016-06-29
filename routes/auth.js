var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/authHelpers');
var passwordHelpers = require('../auth/passwordHelpers');
var knex = require('../db/knex');
// var passport = require('passport');

var passportLocal = require('../auth/local');

/* GET signup */
router.get('/signup', authHelpers.preventLoginSignup, (req,res) => {
  res.render('auth/signup', {message: req.flash('loginMessage')});
})

/* Preventing Login signup */
router.get('/login', authHelpers.preventLoginSignup, (req,res) => {
    res.render('auth/login', {message: req.flash('loginMessage')});
});

/* POST signup */
router.post('/signup', authHelpers.preventLoginSignup, (req, res, next)  => {
  passwordHelpers.createUser(req).then((user) => {
    passportLocal.authenticate('local', (err, user)  => {
      if (err) { return next(err); }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (err)  => {
        if (err) {
          return next(err);
        }
        return res.redirect('/users/');
      });
    })(req, res, next);
  }).catch((err) =>{
    if(err.constraint === 'users_username_unique'){
      err.message = 'username is already taken'
    }
    if(err) {
      req.flash('loginMessage', err.message)
      res.redirect('/auth/signup');
    }
    else {
      res.render('error', {err})
    }
  })
});

/* Authenticate user when logging in */
router.post('/login', passportLocal.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/auth/login'
}))

/* Log out */
router.get('/logout', authHelpers.checkAuthentication, (req,res) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;

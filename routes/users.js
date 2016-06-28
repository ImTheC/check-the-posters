var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

require('locus');

// Users function
function Users() {
  return knex('users');
}

/* Index, get all users. */
router.get('/', function(req, res, next) {
  Users().then((users) => {
    res.render('users/index', {title: 'All Users', users: users})
    // res.json(users);
  })
});

// Create User
router.get('/new', (req, res) => {
  res.render('users/new', {title: 'Create User'});
})

router.post('/', (req, res) => {
  Users().insert(req.body.user).then((user) => {
    res.redirect('/users');
  })
})

// Read a single user
router.get('/:id', (req, res) => {
  Users().where('id', req.params.id).first().then((user) => {
    res.json(user);
  })
})

// Update (Edit)
router.get('/:id/edit', (req, res) => {
  Users().where('id', req.params.id).first().then((user) => {
    res.render('users/edit', {title: 'Edit User', user: user});
  })
})

router.put('/:id', (req, res) => {
  Users().where('id', req.params.id).update(req.body.user).then((user) => {
    eval(locus);
    res.redirect('/users');
  })
})

// Delete a user
router.delete('/:id', (req, res) => {
  Users().where('id', req.params.id).del().then((user) => {
    res.redirect('/users');
  })
})

module.exports = router;

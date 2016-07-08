"use strict";
const bcrypt = require("bcrypt");
const knex = require("../db/knex");

const handleErrors = (req) => {
  return new Promise((resolve,reject) => {
    if(req.body.user.username.length < 6) {
      reject({
        err:'username_length',
        message:'Username must be at least 6 characters.'
      });
    }
		else if (req.body.user.password.length === 0) {
			resolve();
		}
    else if(req.body.user.password.length < 6) {
      reject({
        err:'password_length',
        message:'Password must be at least 6 characters.'
      });
    }
    else {
      resolve();
    }
  });
};

exports.createUser =(req)=> {
    return handleErrors(req).then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.user.password, salt);
      return knex('users').insert({
        name: req.body.user.name,
        username: req.body.user.username,
        password:hash,
      }, "*");
    });
},

exports.editUser =(req)=> {
    return handleErrors(req).then(() => {
			if ( req.body.user.password == "" ) {
				return knex('users').where({id: req.params.id}).update({
	        name: req.body.user.name,
	        username: req.body.user.username
      	}, "*");
			} else {
	      const salt = bcrypt.genSaltSync();
	      const hash = bcrypt.hashSync(req.body.user.password, salt);
	      return knex('users').where({id: req.params.id}).update({
	        name: req.body.user.name,
	        username: req.body.user.username,
	        password:hash,
      	}, "*");
			}
    });
},

exports.comparePass = (userpass, dbpass) => bcrypt.compareSync(userpass, dbpass);

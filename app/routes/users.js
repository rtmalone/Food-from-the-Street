'use strict';

var User = require('../models/user');
//var Item = require('../models/item');
//var request = require('request');

exports.register = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    } else {
      res.render('users/sorry', {title: 'Whoops!'});
    }
  });
};

exports.login = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id.toString();
        req.session.save(function(){
          res.redirect('users/' + req.session.userId);
        });
      });
    }else{
      req.session.destroy(function(){
        res.render('users/auth', {title: 'Something is awry...'});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

// Need a Site.findByTruckId method to return events linked to trucks here
exports.profile = function(req, res){
  User.findById(req.session.userId, function(user){
    res.render('users/profile', {user:user});
  });
};

exports.update = function(req, res){
  User.update(req.session.userId, req.body, function(count){
    res.redirect('users/profile');
  });
};

'use strict';

var User = require('../models/user');
var Site = require('../models/site');
var _ = require('lodash');
var moment = require('moment');

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

exports.profile = function(req, res){
  User.findById(req.session.userId, function(user){
    if(user.role === 'Foodie'){
      User.findAllByRole('Truck', function(trucks){
        user.trucks(function(myTrucks){
          res.render('users/profile', {user:user, trucks:trucks, myTrucks:myTrucks});
        });
      });
    } else {
      Site.findAllByTruckId(req.session.userId, function(sites){
        var sitesToday = _.remove(sites, function(site){
          return site.date === moment().format('YYYY-MM-DD');
        });
        //var sitesNow = _.remove(sitesToday, function(site){
          //return site.endTime > moment().format('HH');
        //});
        res.render('users/profile', {user:user, sites:sitesToday});
      });
    }
  });
};

exports.update = function(req, res){
  User.update(req.session.userId, req.body, function(count){
    res.redirect('users/profile');
  });
};

exports.addTruck = function(req, res){
  console.log('VVVVVVVVVVVVVVVVV');
  console.log(req.session.userId);
  User.findById(req.session.userId, function(user){
    console.log(user);
    user.addTruck(req.body.truckId, function(){
      res.redirect('users/profile');
    });
  });
};

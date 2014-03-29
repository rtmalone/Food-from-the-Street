'use strict';

var Site = require('../models/site');
//var User = require('../models/user');
var Mongo = require('mongodb');

exports.create = function(req, res){
  var site = new Site(req.body);
  site.truckId = Mongo.ObjectID(req.session.userId);
  site.insert(function(data){
    res.redirect('/users/'+req.session.userId);
  });
};

exports.destroy = function(req, res){
  Site.deleteById(req.params.id, function(){
    res.redirect('users/'+req.session.userId);
  });
};

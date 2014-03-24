'use strict';

module.exports = Site;
var sites = global.nss.db.collection('sites');
var Mongo = require('mongodb');
var _ = require('lodash');

function Site(site){
  this.eventName = site.eventName || site.truckName;
  this.address = site.address;
  this.truckName = site.truckName;
  this.startTime = site.startTime;
  this.endTime = site.endTime;
  this.date = new Date(site.date);
  this.coordinates= [site.lat * 1, site.lng * 1];
}

Site.prototype.insert = function(fn){
  sites.insert(this, function(err, records){
    fn(records[0]);
  });
};

Site.update = function(id, obj, fn){
  var _id = Mongo.ObjectID(id);
  sites.update({_id:_id}, {$set: obj}, function(err, count){
    fn(count);
  });
};

Site.findAll = function(fn){
  sites.find().toArray(function(err, records){
    fn(records);
  });
};

Site.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  sites.findOne({_id:_id}, function(err, site){
    fn(_.extend(site, Site.prototype));
  });
};

Site.findClosestByNow = function(query, fn){
  console.log(query);
  var lat = query.lat * 1;
  var lng = query.lng * 1;
  var now = new Date();

  sites.find({'coordinates':{$nearSphere:{$geometry:{type:'Point', coordinates:[lat, lng]}}, $maxDistance : 2500000}}).toArray(function(err, records){
    console.log(records);
    fn(records);
  });
};

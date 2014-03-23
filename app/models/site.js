'use strict';

module.exports = Site;
//var bcrypt = require('bcrypt');
var sites = global.nss.db.collection('sites');
var Mongo = require('mongodb');
//var _ = require('lodash');

function Site(site){
  this.eventName = site.eventName || site.truckName;
  this.address = site.address;
  this.truckName = site.truckName;
  this.startTime = site.startTime;
  this.endTime = site.endTime;
  this.date = new Date(site.date);
  this.coords= [site.lat * 1, site.lng * 1];
}

Site.prototype.insert = function(fn){
  var self = this;
  sites.insert(self, function(err, records){
    fn(records);
  });
};

Site.update = function(id, obj, fn){
  console.log(obj);
  var _id = Mongo.ObjectID(id);
  sites.update({_id:_id}, {$set: obj}, function(err, count){
    fn(count);
  });
};

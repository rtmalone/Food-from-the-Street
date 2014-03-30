'use strict';

module.exports = Site;
var sites = global.nss.db.collection('sites');
var Mongo = require('mongodb');
var _ = require('lodash');

function Site(attrs){
  this.eventName = attrs.eventName || attrs.truckName;
  this.address = attrs.address;
  this.truckName = attrs.truckName;
  this.startTime = attrs.startTime;
  this.endTime = attrs.endTime;
  this.date = attrs.date;
  this.coordinates= [attrs.lat * 1, attrs.lng * 1];
  this.truckId = Mongo.ObjectID(attrs.truckId);
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

Site.findAllByTruckId = function(truckId, fn){
  var _truckId = Mongo.ObjectID(truckId);
  sites.find({truckId: _truckId}).toArray(function(err, records){
    fn(records);
  });
};

Site.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  sites.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

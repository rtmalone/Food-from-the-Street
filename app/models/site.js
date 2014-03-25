'use strict';

module.exports = Site;
var sites = global.nss.db.collection('sites');
var Mongo = require('mongodb');
var _ = require('lodash');
var moment = require('moment');
var dateFormat = 'MM-DD-YYYY HH:mm A';

function Site(attrs){
  this.eventName = attrs.eventName || attrs.truckName;
  this.address = attrs.address;
  this.truckName = attrs.truckName;
  this.startTime = moment(attrs.startTime, dateFormat); //reminder: moment parses string from browser
  this.endTime = moment(attrs.endTime, dateFormat); //reminder: moment parses string from browser
  //this.date = new Date(attrs.date);
  this.coordinates= [attrs.lat * 1, attrs.lng * 1];
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
  var lat = query.lat * 1;
  var lng = query.lng * 1;
  //var now = moment().format('MM-DD-YYYY HH:mm A');

  sites.find({'coordinates':{$nearSphere:{$geometry:{type:'Point', coordinates:[lat, lng]}},
    $maxDistance : 2500000}}).toArray(function(err, records){
    fn(records);
    /*
    fn(_.filter(records, function(rec){
      console.log(records);
      //return records;
      //return moment().startOf('day').toDate().format('MM-DD-YYYY HH:mm A') < rec.startTime && moment().endOf('day').toDate().format('MM-DD-YYYY HH:mm A') > rec.startTime;
    }));*/
  });
};

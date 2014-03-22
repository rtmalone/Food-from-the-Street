/* jshint expr:true */

'use strict';

process.env.DBNAME = 'truck-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
//var exec = require('child_process').exec;
//var fs = require('fs');
var Site, s2;

describe('Site', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Site = require('../../app/models/site');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      s2 = new Site({eventName: 'Angular Party',
                     truckName: 'Smoke et al',
                     startTime: '11:00 AM',
                     endTime: '1:00 PM',
                     date: '03/23/14',
                     address: '123 Main St',
                     lat: '36',
                     lng: '32',});
      done();
    });
  });
  
  describe('#new', function(){
    it('should create a new Site', function(done){
      var s1 = new Site({eventName: 'Node Party',
                         truckName: 'Wrappers Delight',
                         startTime: '11:00 AM',
                         endTime: '1:00 PM',
                         date: '03/23/14',
                         address: '123 Main St',
                         lat: '31',
                         lng: '32',});
      expect(s1).to.be.instanceof(Site);
      expect(s1.eventName).to.equal('Node Party');
      expect(s1.coords).to.be.an('array');
      expect(s1.coords[0]).to.equal(31);
      done();
    });
  });

  describe('#insert', function(){
    it('should insert a Site into the db', function(done){
      s2.insert(function(){
        expect(s2._id).to.be.instanceof(Mongo.ObjectID);
        expect(s2.eventName).to.equal('Angular Party');
        done();
      });
    });
  });
///END
});

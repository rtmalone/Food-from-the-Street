/* jshint expr:true */

'use strict';

process.env.DBNAME = 'truck-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
//var moment = require('moment');
//var exec = require('child_process').exec;
//var fs = require('fs');
var Site, s2, s3;

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
      global.nss.db.collection('sites').ensureIndex({'coordinates':'2dsphere'}, function(err, indexName){
        s2 = new Site({eventName: 'Angular Party',
                       truckName: 'Smoke et al',
                       startTime: '03/24/14 11:00 AM',
                       endTime: '03/24/14 1:00 PM',
                       address: '123 Main St',
                       lat: '36',
                       lng: '32',});
        s3 = new Site({eventName: 'NSS Party',
                       truckName: 'Grilled Cheeserie',
                       startTime: '03/25/14 5:00 PM',
                       endTime: '03/25/14 7:00 PM',
                       address: '789 Main St',
                       lat: '36',
                       lng: '40',});
        done();
      });
    });
  });

  describe('#new', function(){
    it('should create a new Site', function(done){
      var s1 = new Site({eventName: 'Node Party',
                         truckName: 'Wrappers Delight',
                         startTime: '03/23/14 11:00 AM',
                         endTime: '03/23/14 1:00 PM',
                         address: '123 Main St',
                         lat: '31',
                         lng: '32',});
      expect(s1).to.be.instanceof(Site);
      expect(s1.eventName).to.equal('Node Party');
      expect(s1.coordinates).to.be.an('array');
      expect(s1.coordinates[0]).to.equal(31);
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

  describe('#update', function(){
    it('should update a site record', function(done){
      s2.insert(function(){
        Site.update(s2._id.toString(), {endTime: '03/14/14 1:30 PM',
                                        address: '345 Main St'},
                                        function(ret){
          expect(ret).to.equal(1);
          done();
        });
      });
    });
  });

  describe('.findAll', function(){
    it('should find all sites in db', function(done){
      s2.insert(function(){
        s3.insert(function(){
          Site.findAll(function(sites){
            expect(sites).to.have.length(2);
            done();
          });
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find a site by id', function(done){
      s2.insert(function(){
        s3.insert(function(){
          var site3Id = s3._id.toString();
          Site.findById(site3Id, function(site){
            expect(site._id.toString()).to.equal(site3Id);
            done();
          });
        });
      });
    });
  });

  describe('.findClosestByNow', function(){
    it('should find closest Sites within a time frame', function(done){
      var s4 = new Site({eventName: 'Courthouse',
                     truckName: 'wrappers delight',
                     startTime: '11:00 AM',
                     endTime: '1:00 PM',
                     date: '03/24/14',
                     address: '123 Main St',
                     lat: '40',
                     lng: '41',});
      var s5 = new Site({eventName: 'Hospital',
                     truckName: 'Grilled Cheeserie',
                     startTime: '5:00 PM',
                     endTime: '7:00 PM',
                     date: '03/27/14',
                     address: '789 Main St',
                     lat: '36',
                     lng: '36',});
      s4.insert(function(){
        s5.insert(function(){
          var localObj = {lat: 36, lng: 35};
          Site.findClosestByNow(localObj, function(records){
            expect(records[0].eventName).to.equal('Hospital');
            done();
          });
        });
      });
    });
  });
/*
  describe('.findClosestByNow', function(){

    describe('when start is not today', function(){
      it('should not find the site', function(done){
        var s4 = new Site({eventName: 'Courthouse',
                       truckName: 'wrappers delight',
                       startTime: '03/23/14 11:00 AM',
                       endTime: '03/23/14 1:00 PM',
                       address: '123 Main St',
                       lat: '40',
                       lng: '41',});
        s4.insert(function(){
          var localObj = {lat: 36, lng: 35};
          Site.findClosestByNow(localObj, function(records){
            expect(records).to.have.length(0);
            done();
          });
        });
      });
    });

    describe('when start is today', function(){
      it('should find nearby Sites which have not ended', function(done){
        var s5 = new Site({eventName: 'Hospital',
                       truckName: 'Grilled Cheeserie',
                       startTime: '03/25/14 5:00 PM',
                       endTime: '03/25/14 9:00 PM',
                       address: '789 Main St',
                       lat: '36',
                       lng: '36',});
        s5.insert(function(){
          var localObj = {lat: 36, lng: 35};
          Site.findClosestByNow(localObj, function(records){
            expect(records).to.have.length(2);
            expect(records[0].eventName).to.equal('Hospital');
            done();
          });
        });
      });
    });

    describe('when start is today', function(){
      it('should not find sites which have ended', function(done){
        var s6 = new Site({eventName: 'Daymar',
                       truckName: 'Grilled Cheeserie',
                       startTime: '03/25/14 5:00 AM',
                       endTime: '03/25/14 9:00 AM',
                       address: '1010 Main St',
                       lat: '37',
                       lng: '36',});
        s6.insert(function(){
          var localObj = {lat: 36, lng: 35};
          Site.findClosestByNow(localObj, function(records){
            expect(records).to.have.length(0);
            done();
          });
        });
      });
    });
  });*/

///END
});

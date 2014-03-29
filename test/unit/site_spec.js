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
                       lng: '32',
                       truckId: '111111111111111111111111'});
        s3 = new Site({eventName: 'NSS Party',
                       truckName: 'Grilled Cheeserie',
                       startTime: '03/25/14 5:00 PM',
                       endTime: '03/25/14 7:00 PM',
                       address: '789 Main St',
                       lat: '36',
                       lng: '40',
                       truckId: '111111111111111111111111'});
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
                         lng: '32',
                         truckId: '333333333333333333333333'});
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

  describe('.findAllByTruckId', function(){
    it('should find all sites by truckId', function(done){
      var s6 = new Site({eventName: 'Courthouse6',
                     truckName: 'wrappers delight',
                     startTime: '11:00 AM',
                     endTime: '1:00 PM',
                     date: '03/24/14',
                     address: '123 Main St',
                     lat: '40',
                     lng: '41',
                     truckId: '444444444444444444444444'});
      s2.insert(function(){
        s3.insert(function(){
          s6.insert(function(){
            Site.findAllByTruckId('111111111111111111111111', function(sites){
              expect(sites).to.have.length(2);
              done();
            });
          });
        });
      });
    });
  });

  describe('.deleteById', function(){
    it('should delete site by ID', function(done){
      s2.insert(function(){
        s3.insert(function(){
          var site3Id = s3._id.toString();
          console.log(site3Id);
          Site.deleteById(site3Id, function(count){
            expect(count).to.equal(1);
            done();
          });
        });
      });
    });
  });
///END
});

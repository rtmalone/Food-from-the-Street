/* jshint expr:true */

'use strict';

process.env.DBNAME = 'truck-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
//var exec = require('child_process').exec;
//var fs = require('fs');
var User, u1;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({name: 'John',
                     email: 'mylovelytn@nomail.com',
                     phone:'111-111-1111',
                     password:'1234',
                     role:'Foodie'});
      u1.register(function(){
        done();
      });
    });
  });

  describe('#new', function(){
    it('should create a new user', function(done){
      expect(u1).to.be.instanceof(User);
      expect(u1.name).to.equal('John');
      expect(u1.role).to.equal('Foodie');
      expect(u1.phone).to.equal('111-111-1111');
      done();
    });
  });

  describe('#register', function(){
    it('should insert new user into database', function(done){
      var tyler = new User({name: 'Tyler',
                     email: 'mylovelytn@gmail.com',
                     phone:'111-111-1111',
                     password:'1234abc',
                     role:'Foodie'});
      tyler.register(function(err,body){
        expect(err).to.not.be.ok;
        expect(tyler.password).to.have.length(60);
        expect(tyler._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });
    it('should not insert a new user into db with dup email', function(done){
      var u2 = new User({name: 'John',
                     email: 'mylovelytn@nomail.com',
                     phone:'111-111-1111',
                     password:'1234',
                     role:'Foodie'});
      u2.register(function(err){
        expect(u2._id).to.be.undefined;
        done();
      });
    });
  });
/*
  describe('#update', function(){
    it('should allow user to update info', function(done){
      User.update(u1, {name: 'Sarah',
                   phone:'111-222-3333',
                   role:'Truck'}, function(ret, user){
        expect(ret).to.equal(1);
        expect(user.name).to.equal('Sarah');
        expect(user.phone).to.equal('111-222-3333');
        expect(user.role).to.equal('Truck');
        done();
      });
    });
  });
  */

/*
  describe('.findById', function(){
    it('should find a user by ID', function(done){
      u1.insert(function(){
        u2.insert(function(){
          var user2Id = u2._id.toString();
          User.findById(user2Id, function(user){
            expect(user._id.toString()).to.equal(user2Id);
            done();
          });
        });
      });
    });
  });

  describe('.findByFacebookId', function(){
    it('should find a user by fb ID', function(done){
      u2.insert(function(){
        User.findByFacebookId(u2.facebookId, function(ret){
          expect(ret.facebookId).to.equal('1234');
          done();
        });
      });
    });
  });
*/
////END////
});

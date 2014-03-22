/* jshint expr:true */

'use strict';

process.env.DBNAME = 'truck-test';
var expect = require('chai').expect;
//var Mongo = require('mongodb');
//var exec = require('child_process').exec;
//var fs = require('fs');
var User, u1, u3, u4;

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
      u3 = new User({name: 'Courtney',
                     email: 'courtney@nomail.com',
                     phone:'222-222-2222',
                     password:'5678',
                     role:'Truck'});
      u4 = new User({name: 'Poptart',
                     email: 'poptart@nomail.com',
                     phone:'333-333-2222',
                     password:'abcd',
                     role:'Truck'});
      u1.register(function(){
        u3.register(function(){
          u4.register(function(){
            done();
          });
        });
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
    it('should register a new user into database', function(done){
      var tyler = new User({name: 'Tyler',
                     email: 'mylovelytn@gmail.com',
                     phone:'111-111-1111',
                     password:'1234abc',
                     role:'Foodie'});
      tyler.register(function(err,body){
        expect(err).to.not.be.ok;
        expect(tyler.password).to.have.length(60);
        //expect(tyler._id).to.be.instanceof(Mongo.ObjectID);   <----uncomment for true testing
        body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });

    it('should not register a new user into db with dup email', function(done){
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

  describe('.findByEmailAndPassword', function(){
    it('should find a user', function(done){
      User.findByEmailAndPassword('mylovelytn@nomail.com', '1234', function(user){
        expect(user).to.be.ok;
        done();
      });
    });
    it('should not find user - bad email', function(done){
      User.findByEmailAndPassword('wrong@nomail.com', '1234', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
    it('should not find user - bad password', function(done){
      User.findByEmailAndPassword('mylovelytn@nomail.com', 'wrong', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
  });

  describe('.update', function(){
    it('should allow user to update info', function(done){
      User.update(u1._id.toString(), {name: 'Sarah',
                   phone:'111-222-3333',
                   role:'Truck'}, function(ret, user){
        expect(ret).to.equal(1);
        User.findById(u1._id.toString(), function(record){
          expect(record.name).to.equal('Sarah');
          expect(record.phone).to.equal('111-222-3333');
          expect(record.role).to.equal('Truck');
          done();
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find a user by ID', function(done){
      var user3Id = u3._id.toString();
      User.findById(user3Id, function(user){
        expect(user._id.toString()).to.equal(user3Id);
        expect(user.name).to.equal('Courtney');
        done();
      });
    });
  });

  describe('.findAllByRole', function(){
    it('should find a user by role', function(done){
      User.findAllByRole('Foodie', function(users){
        expect(users).to.have.length(1);
        User.findAllByRole('Truck', function(users){
          expect(users).to.have.length(2);
          done();
        });
      });
    });
  });

  describe('.addTruck', function(){
    it('should add a truck to Foodie user', function(done){
      var truckID = u4._id.toString();
      u1.addTruck(truckID, function(count){
        expect(count).to.equal(1);
        expect(u1.trucks).to.have.length(1);
        expect(u1.trucks[0].toString()).to.equal(truckID);
        done();
      });
    });
  });

  describe('.removeTruck', function(){
    it('should remove a truck from Foodie user', function(done){
      var truckID = u4._id.toString();
      u1.addTruck(truckID, function(count){
        expect(count).to.equal(1);
        u1.removeTruck(truckID, function(count){
          expect(count).to.equal(1);
          //expect(u1.trucks).to.have.length(0);
          done();
        });
      });
    });
  });
/*
  describe('.findByTruck', function(){
    it('should find all Foodies associated with a specific truck', function(done){
      
    });
  });
*/
////END////
});

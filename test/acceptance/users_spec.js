'use strict';

process.env.DBNAME = 'truck-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User, cookie, sue;

describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      sue = new User({name: 'sue',
                      phone: '111-111-1111',
                      email:'testsue@aol.com',
                      password:'abcd',
                      role: 'Foodie'});
      sue.register(function(){
        done();
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('POST /register', function(){
    before(function(done){
      global.nss.db.dropDatabase(function(err, result){
        var s = new User({email:'testsue@aol.com', password:'abcd'});
        s.register(function(){
          done();
        });
      });
    });

    it('should register a user', function(done){
      request(app)
      .post('/register')
      .field('name', 'bob')
      .field('phone', '123-456-7890')
      .field('role', 'Foodie')
      .field('email', 'testbob@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not register a user due to duplicate', function(done){
      request(app)
      .post('/register')
      .field('email', 'testsue@aol.com')
      .field('password', 'abcd')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Whoops!');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .field('email', 'testsue@aol.com')
      .field('password', 'abcd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers['set-cookie']).to.have.length(1);
        done();
      });
    });

    it('should not login a user due to bad login', function(done){
      request(app)
      .post('/login')
      .field('email', 'testbob@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Something is awry');
        done();
      });
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('email', 'testsue@aol.com')
      .field('password', 'abcd')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /users:id', function(){
      it('should show a user profile', function(done){
        request(app)
        .get('/users/1234')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('POST /updateUser', function(){
      it('should update a user', function(done){
        request(app)
        .post('/updateUser')
        .set('cookie', cookie)
        .field('phone', '222-222-2222')
        .field('role', 'Truck')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          done();
        });
      });
    });
  });
/*
  describe('POST /addTruck', function(){
    it('should add a truck to a user', function(done){
      request(app)
      .post('/users/addTruck')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });*/
  /////END DESCRIBE
});


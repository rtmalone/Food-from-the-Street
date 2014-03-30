'use strict';

process.env.DBNAME = 'truck-test';
var app = require('../../app/app');
var request = require('supertest');
var User, Site;
var cookie;
var truck1, site1;
var site1Id;

describe('items', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Site = require('../../app/models/site');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      truck1 = new User({name: 'Wrappers Delight',
                             email: 'wrapperDel@nomail.com',
                             phone: '111-111-1111',
                             password: '1234',
                             role: 'Truck'});
      truck1.register(function(){

        site1 = new Site({eventName: 'Code Party',
                       truckName: 'Smoke et al',
                       startTime: '03/24/14 11:00 AM',
                       endTime: '03/24/14 1:00 PM',
                       address: '123 Main St',
                       lat: '36',
                       lng: '32',
                       truckId: '111111111111111111111111'});
        site1.insert(function(){
          site1Id = site1._id.toString();
          done();
        });
      });
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('email', 'wrapperDel@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('POST /sites', function(){
      it('should create a new site', function(done){
        request(app)
        .post('/sites')
        .set('cookie', cookie)
        .field('eventName', 'test event')
        .field('address', '1438 McAlpine Ave, Nashville, TN')
        .field('truckName', 'Wrappers Delight')
        .field('startTime', '03/28/14 11:00 AM')
        .field('endTime', '03/28/14 01:30 PM')
        .field('date', '03/28/14')
        .expect(302, done);
      });
    });
  });

  describe('DELETE /sites/:id', function(){
    it('should delete a specific isite from the db', function(done){
      request(app)
      .del('/sites/' + site1Id)
      .set('cookie', cookie)
      .expect(302, done);
    });
  });

//////////
});


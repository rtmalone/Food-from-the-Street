'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');
  var sites = require('../routes/sites');

  app.get('/', d, home.index);
  app.post('/register', d, users.register);
  app.post('/login', d, users.login);
  app.post('/logout', d, users.logout);
  app.post('/updateUser', d, users.update);
  app.post('/users/addTruck', d, users.addTruck);
  app.delete('/removeTruck/:id', d, users.removeTruck);
  app.get('/users/:id', d, users.profile);

  app.post('/sites', d, sites.create);
  app.delete('/sites/:id', d, sites.destroy);


  console.log('Routes Loaded');
  fn();
}


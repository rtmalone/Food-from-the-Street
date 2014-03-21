'use strict';

module.exports = User;
var bcrypt = require('bcrypt');
var email = require('../lib/email');
var users = global.nss.db.collection('users');

function User(user){
  this.name = user.name;
  this.phone = user.phone;
  this.email = user.email;
  this.password = user.password;
  this.role = user.role;
  this.favTrucks = [];
}

//// Note to self: update should only update specific keys; route rerender page
/*
User.prototype.update = function(user, obj, res){
  console.log('VVVVVVVVVVVVVVVVV');
  console.log(obj);
  userId = new Mongo.ObjectID(user._id);
  users.update({_id:id, {$set: {obj}}, function(err, count){
    res.send
  });
};
*/

User.prototype.register = function(fn){
  var self = this;
  hashPassword(self.password, function(hashed){
    self.password = hashed;
    insert(self, function(err){
      if(self._id){
        email.sendWelcome({to:self.email}, function(err, body){
          fn(err, body);
        });
      } else {
        fn();
      }
    });
  });
};

function hashPassword(password, fn){
  bcrypt.hash(password, 10, function(err, hash){
    fn(hash);
  });
}

function insert(user, fn){
  users.findOne({email:user.email}, function(err, foundUser){
    if(!foundUser){
      users.insert(user, function(err, record){
        fn(err);
      });
    } else {
      fn();
    }
  });
}

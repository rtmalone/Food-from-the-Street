'use strict';

module.exports = User;
var bcrypt = require('bcrypt');
var email = require('../lib/email');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

function User(user){
  this.name = user.name;
  this.phone = user.phone;
  this.email = user.email;
  this.password = user.password;
  this.role = user.role;
  this.favTrucks = [];
}

//// Note to self: update should only update specific keys; route rerender page

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

User.update = function(id, obj, fn){
  var userId = Mongo.ObjectID(id);
  users.update({_id:userId}, {$set: obj}, function(err, count){
    fn(count);
  });
};

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, User.prototype));
  });
};

User.findAllByRole = function(role, fn){
  users.find({role:role}).toArray(function(err, records){
    fn(records);
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, user){
    if(user){
      bcrypt.compare(password, user.password, function(err, result){
        if(result){
          fn(user);
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

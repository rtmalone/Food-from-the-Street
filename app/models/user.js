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
  this.truckIds = [];
}

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

// Note to self: update should only update specific keys; route rerender page
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

// May need to return to addTruck and removeTruck once more info
// is obtained about prototype vs class methods
User.prototype.addTruck = function(truckID, fn){
  var self = this;
  var _truckID = Mongo.ObjectID(truckID);
  console.log(_truckID);
 // var contain = _.contains(this.trucks, _truckID);
  //if(!contain){
    //this.trucks.push(_truckID);
  //}
  users.update({_id:self._id}, {$addToSet: {truckIds: _truckID}}, function(err, count){
    fn(count);
  });
};

User.removeTruck = function(truckID, fn){
  var _truckID = Mongo.ObjectID(truckID);
  users.update({truckIds: _truckID}, {$pull: {truckIds: _truckID}}, function(err, count){
    fn(count);
  });
};

User.findFoodiesByTruck = function(truckID, fn){
  var _truckID = Mongo.ObjectID(truckID);
  users.find({truckIds: _truckID}).toArray(function(err, foodies){
    fn(foodies);
  });
};

User.prototype.trucks = function(fn) {
  //var ids = _.map(this.truckIds, function(id){ return Mongo.ObjectID(id);});
  users.find({role: 'Truck', _id: { $in: this.truckIds }}).toArray(function(err, trucks){
    fn(trucks);
  });
};

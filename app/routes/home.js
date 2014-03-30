'use strict';

var Site = require('../models/site');
var moment = require('moment');
var _ = require('lodash');

exports.index = function(req, res){
  Site.findAll(function(sites){
    var sitesToday = _.remove(sites, function(site){
      return site.date === moment().format('YYYY-MM-DD');
    });
    var sitesNow = _.remove(sitesToday, function(site){
      return site.endTime > moment().format('HH');
    });
    console.log(sitesNow);
    res.render('home/index', {title: 'Food on the Street', sites:sitesNow});
  });
};


'use strict';

var Site = require('../models/site');
var moment = require('moment');
var _ = require('lodash');

exports.index = function(req, res){
  Site.findAll(function(sites){
    console.log(sites);
    var sitesToday = _.remove(sites, function(site){
      //console.log(site.date);
      //console.log('>',moment().format('YYYY-MM-DD'));
      return site.date === moment().format('YYYY-MM-DD');
    });
    //console.log(sitesToday);
    var sitesNow = _.remove(sitesToday, function(site){
      //console.log(site.endTime);
      //console.log('>>>',moment().format('HH:mm'));
      return site.endTime > moment().format('HH:mm');
    });
    res.render('home/index', {title: 'Food on the Street', sites:sitesNow});
  });
};


/* global google:true */
/* jshint camelcase:false */

(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $('#createEventBtn').click(clickCreate);
  }

  function clickCreate(event){
    var address = $('#addressInput').val();

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address}, function(results, status){
      console.log(results);
      var name = results[0].formatted_address;  // google returns mult results; the first is always the best to use
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();

      $('#addressInput').val(name);
      $('input[name="lat"]').val(lat);
      $('input[name="lng"]').val(lng);

      $('form').submit();

    });
    event.preventDefault();
  }

})();


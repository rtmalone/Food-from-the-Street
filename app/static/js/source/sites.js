/* global google:true, places:true */
/* jshint camelcase:false */


(function(){

  'use strict';


  $(document).ready(initialize);

  var map, lat, lng;
  var markers = [];
  var styledArray = [
    {'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},
    {'featureType':'landscape','stylers':[{'color':'#efefef'}]},
    {'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},
    {'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},
    {'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},
    {'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},
    {'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},
    {'featureType':'road'},
    {'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},
    {'featureType':'road','stylers':[{'lightness':20}]}
  ];

  function initialize(){
    initMap(36.1666, -86.7833, 12);
    for(var i = 0; i < places.length; i++){
      addMarker(places[i]);
    }
    findMyLocation();
    $('#search').click(clickSearch);
  }

  function clickSearch(){
    var url = '/listings/query?lat=' + lat + '&lng=' + lng;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }

  function findMyLocation(){
    getLocation();
  }

  function getLocation(){
    var geoOptions = {enableHighAccuracy: true, maximumAge: 1000, timeout: 60000};
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function geoSuccess(location) {
    lat = location.coords.latitude;
    lng = location.coords.longitude;
    $('#search').show();
  }

  function geoError() {
    console.log('Sorry, no position available.');
  }

  function initMap(lat, lng, zoom){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styledArray};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function addMarker(location){
    var sTime = moment(location.startTime, 'H:mm').format('h:mm a');
    var eTime = moment(location.endTime, 'H:mm').format('h:mm a');
    var position = new google.maps.LatLng(location.coordinates[0], location.coordinates[1]);
    var content = '<div id="markerContent"><h6>'+location.truckName+'</h6>'+
                  '<p>'+sTime+'<span>'+'&nbsp;-&nbsp;'+'</span>'+eTime+
                  '<br>'+location.address+'</p>'+
                  '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: content
    });
    var marker = new google.maps.Marker({map:map, position:position, title:location.address});
    markers.push(marker);
    //content for window
    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(map,marker);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close(map,marker);
    });
  }

})();

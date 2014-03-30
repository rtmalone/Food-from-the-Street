/* global google:true, places:true */
/* jshint camelcase:false */


(function(){

  'use strict';


  $(document).ready(initialize);

  var map, lat, lng;
  var markers = [];
  var styledArray = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},
    {'featureType':'landscape','stylers':[{'color':'#f2e5d4'}]},
    {'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'}]},
    {'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'}]},
    {'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'}]},
    {'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'}]},
    {'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},
    {'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},
    {},
    {'featureType':'road','stylers':[{'lightness':20}]}
  ];
  /*
  var styledArray = [
    {'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},
    {'featureType':'water','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#C6E2FF'}]},
    {'featureType':'poi','elementType':'geometry.fill','stylers':[{'color':'#C5E3BF'}]},
    {'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#D1D1B8'}]}
  ];
  */
  /*
  var styledArray =[
    {'featureType':'administrative','stylers':[{'visibility':'off'}]},
    {'featureType':'poi','stylers':[{'visibility':'simplified'}]},
    {'featureType':'road','elementType':'labels','stylers':[{'visibility':'simplified'}]},
    {'featureType':'water','stylers':[{'visibility':'simplified'}]},
    {'featureType':'transit','stylers':[{'visibility':'simplified'}]},
    {'featureType':'landscape','stylers':[{'visibility':'simplified'}]},
    {'featureType':'road.highway','stylers':[{'visibility':'off'}]},
    {'featureType':'road.local','stylers':[{'visibility':'on'}]},
    {'featureType':'road.highway','elementType':'geometry','stylers':[{'visibility':'on'}]},
    {'featureType':'water','stylers':[{'color':'#84afa3'},{'lightness':52}]},
    {'stylers':[{'saturation':-17},{'gamma':0.36}]},
    {'featureType':'transit.line','elementType':'geometry','stylers':[{'color':'#3f518c'}]}
  ];
  */
  /*
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
  */

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
    var content = '<div id="markerContent"><h6><u>'+location.truckName+'</u></h6>'+
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
    google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(15);
      map.setCenter(marker.getPosition());
      //currentClick = marker;
    });
  }

})();

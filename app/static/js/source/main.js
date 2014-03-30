(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#addressInput').geocomplete();
    //$.fn.geocomplete('#addressInput');
  }


})();


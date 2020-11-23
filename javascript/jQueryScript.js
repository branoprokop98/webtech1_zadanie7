
/*
    Stop carousel
*/

$(document).ready(function () {
  $("#carousel-example-1z").carousel('pause');

  $('#startAnimation').click(function(){
    $("#carousel-example-1z").carousel('cycle');
  })

  $('#stopAnimation').click(function(){
    $("#carousel-example-1z").carousel('pause');
  })
});




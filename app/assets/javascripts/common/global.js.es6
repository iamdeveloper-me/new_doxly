$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {

  // add this class to any element you want to hide the default tooltip on.
  $('.no-title').on('mouseover', function(e) {
    $(e.target).prop('title', '')
  })

  // create a new 'hide' trigger
  // sets variable to old hide function
  var _oldhide = $.fn.hide;
  // overwrite hide function
  $.fn.hide = function(speed, callback) {
    // set hide trigger
    $(this).trigger('hide');
    // call old function
    return _oldhide.apply(this,arguments);
  }
})

$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {

  // note: when we have multiple grids, this won't work...we'll need to scope it somehow
  $('.grid-cols').on("scroll", function(e) {
    $('.grid-view.sticky > .grid-cols').css('marginLeft', `${-1*$(e.target).scrollLeft()}px`)
  })

})

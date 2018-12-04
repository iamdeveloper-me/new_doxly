App.MobileMenu = {
  initialize: function() {
    App.MobileMenu.bindToggle()
    App.MobileMenu.bindSmallViewToggle()
  },

  bindToggle: function() {
    $('.mobile-menu > .hamburger').off('click').on('click', function() {
      $(this).closest('.mobile-nav').toggleClass('open')
    })
  },

  bindSmallViewToggle: function() {
    $('.small-view-menu > .hamburger').off('click').on('click', function() {
      $(this).closest('.small-view-nav').toggleClass('open')
    })
  }
}

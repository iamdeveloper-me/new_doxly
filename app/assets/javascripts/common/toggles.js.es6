App.Toggles = {

  initialize: function() {
    App.Toggles.bindToggle()
  },

  bindToggle: function() {
    $('.toggle .toggle-trigger')
      .off('click')
      .on('click', function(e) {
        const object = $(this)
        const toggle = object.closest('.toggle')
        // Allows us to change a text message when toggling. See deal_signature_packets.html.erb
        if (object.hasClass('toggle-text')) {
          let newToggleText = object.data('toggle')
          object.data('toggle', object.find('div span').html())
          object.find('div span').html(newToggleText)
        }
        App.Toggles.toggle(toggle, !toggle.hasClass('expanded'))
      })
  },

  toggle: function(element, isOpen) {
    if (element.length){
      // update session storage
      App.LocalStorage.setIsOpen($(element).attr('id'), isOpen)

      // toggle visibility
      $(element).toggleClass('expanded', isOpen)
    }
  }

}

$(document).on('turbolinks:load', function() {
  App.Toggles.initialize()
});

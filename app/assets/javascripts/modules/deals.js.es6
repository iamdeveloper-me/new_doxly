App.Deals = {

  initialize: function() {
    App.Deals.bindDealEmail()
    App.Deals.initializeLocalStorage()
  },

  bindDealEmail: function() {
    // show or hide deal email
    $('.use-deal-email-checkbox').off('change').on('change', function(e) {
      $('.use-deal-email').toggleClass('hidden')
    })

    if (!$('.use-deal-email-checkbox').is(':checked')) {
      $('.use-deal-email').toggleClass('hidden')
    }
  },

  initializeLocalStorage: function() {
    App.LocalStorage.initialize()

    // category view
    if(App.LocalStorage.getItem('category-view') === 'documents') {
      $('#document-list').click() // TODO: We shouldn't be simulating clicks, but this was the simple way to do it since we are using Bootstrap
    }

    App.LocalStorage.restoreOpenState();
  },

  executedVersions: function(modalHtml) {
    $('body').append(modalHtml)
  }

}

$(document).on('turbolinks:load', function() {
  App.Deals.initialize()
});

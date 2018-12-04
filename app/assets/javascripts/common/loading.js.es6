App.LoadingIndicator = {

  timeoutId: undefined,

  initialize: function() {
    App.LoadingIndicator.bindAsyncEvents()
  },

  bindAsyncEvents: function() {
    $(document).off('ajax:send, ajaxSend')
    $(document).on('ajax:send, ajaxSend', function(e, xhr) {
      if (App.LoadingIndicator.timeoutId !== undefined || App.LoadingIndicator.isReact()) {
        return
      }
      App.LoadingIndicator.timeoutId = setTimeout(function() {
        App.LoadingIndicator.show(e, xhr)
      }, 1000)
    })

    $(document).off('ajaxStop, ajax:success, ajax:complete, ajaxSuccess, ajaxComplete')
    $(document).on('ajaxStop, ajax:success, ajax:complete, ajaxSuccess, ajaxComplete', function(e, xhr) {
      if (App.LoadingIndicator.timeoutId == undefined) {
        return
      }
      clearTimeout(App.LoadingIndicator.timeoutId)
      App.LoadingIndicator.timeoutId = undefined
      App.LoadingIndicator.hide(e, xhr)
    })
  },

  isReact: function() {
    return $('.react-root').size() === 1
  },

  show: function(e, xhr) {
    if ($('#loading-indicator')) {
      $.blockUI({
        message: $('#loading-indicator'),
        fadeIn: 500,
        baseZ: 10000,
        css: {
          'position': 'absolute',
          'top': '20px',
          'right': '50px',
          'width': '300px',
          'left': 'inherit',
          'text-align': 'left',
          'background': 'none',
          'border': '0px'
        },
        overlayCSS: {
          opacity: 0.2
        }
      })
    }
  },

  hide: function(e, xhr) {
    $.unblockUI()
  }

}

$(document).on('turbolinks:load', function() {
  App.LoadingIndicator.initialize()
});

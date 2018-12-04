
window.App = {

  clearCache: false,

  Helpers: {

    initialize: function() {
      App.Helpers.bindTurboSelectors()
      App.FlashMessages.bindAlertTimer()
    },

    bindTurboSelectors: function() {
      $('.clear-turbolinks-cache').on('click', function(e) {
        Turbolinks.clearCache()
        return true
      })

      $('form').not('.no-turboboost').attr('data-turboboost', true)
      $('form').not('.no-turboboost').attr('data-remote', true)
    },

    clearTurbolinksCache: function() {
      Turbolinks.clearCache()
    },

    navigateTo: function(path, clearCache) {
      clearCache = clearCache == true
      App.clearCache = clearCache
      Turbolinks.visit(path)
    },

    preventDefault: function(e) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      else {
        e.returnValue = false
      }
    },

    stopPropagation: function(e) {
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      else {
        e.returnValue = false
      }
    },

    formatNumber: function(number, n, s, c, x) {
      if (!number || !1*number) {
        return number
      }

      x = x || 3
      s = s || ","
      c = c || "."

      if (n === null || n === undefined) {
        const decimalStr = number.toString().split(".")[1]
        n = decimalStr && decimalStr.length || 0
      }

      const re = '\\d(?=(\\d{' + (x) + '})+' + (n > 0 ? '\\D' : '$') + ')',
          num = (1*number).toFixed(Math.max(0, ~~n))

      return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','))
    },

    delay: (function() {
      return function(callback, ms){
        setTimeout(callback, ms);
      }
    })(),

    getUrlVars: function() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    }

  }

}

$(document).on('turbolinks:load  turboboost:complete', function() {
  App.Helpers.initialize()
})
$(document).on('turbolinks:render', function() {
  if (App.clearCache == true) {
    App.clearCache = false
    App.Helpers.clearTurbolinksCache()
  }
})

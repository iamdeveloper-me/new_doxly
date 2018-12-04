App.LocalStorage = {

  initialize: function() {
    window.supportsLocalStorage = window.supportsLocalStorage || App.LocalStorage.checkLocalStorage()
    // initialize the deals and users key values
    App.LocalStorage.setItem('deals', App.LocalStorage.getItem('deals') || {})
    App.LocalStorage.setItem('users', App.LocalStorage.getItem('users') || {})
  },

  setIsOpen: function(id, isOpen) {
    // get data from store
    let deals = App.LocalStorage.getItem('deals')
    let dealId = $('#deal_id').val()

    // if no data exists for this deal, initialize it to empty
    if(dealId) {
      if(!(dealId in deals)) {
        deals[dealId] = {}
      }

      // set to open/closed
      deals[dealId][id] = isOpen
      App.LocalStorage.setItem('deals', deals)
    } else {
      let users = App.LocalStorage.getItem('users')
      users[id] = isOpen
      App.LocalStorage.setItem('users', users)
    }
  },

  restoreOpenState: function() {
    /* DEALS */
    // get data from store
    let deals = App.LocalStorage.getItem("deals")
    let dealId = $('#deal_id').val()

    // find the matching deal data
    if (deals) {
      if(dealId in deals) {

        // iterate over the data, opening/closing each element
        let deal = deals[dealId]
        for(const element in deal) {
          App.Toggles.toggle($(`#${element}`), deal[element])
        }
      }

      /* USERS */
      // get data from store
      let users = App.LocalStorage.getItem("users")

      // find the matching users
      for(const user in users) {
        if($(`#${user}`).length) { // necessary or it passes in an init function as the jquery object
          App.Toggles.toggle($(`#${user}`), users[user])
        }
      }
    }
  },

  checkLocalStorage: function() {
    let hasLocalStorage = typeof(Storage) !== "undefined"
    if (hasLocalStorage) {
      // Custom IT security policies sometimes reject storing items in
      // localStorage even though it is available in the browser.
      // So, we'll have to verify that we can actually store the key
      try {
        localStorage.setItem('testKey', "testValue")
        if (localStorage.getItem('testKey') !== "testValue") {
          hasLocalStorage = false
        }
        localStorage.removeItem('testKey')
      } catch (e) {
        hasLocalStorage = false
      }
    }
    return hasLocalStorage
  },

  getItem: function(value) {
    if (window.supportsLocalStorage) {
      return JSON.parse(localStorage.getItem(value))
    } else {
      return Cookies.getJSON(value)
    }
  },

  setItem: function(key, value) {
    if (window.supportsLocalStorage) {
      value = (value === undefined) ? null : value
      return localStorage.setItem(key, JSON.stringify(value))
    } else {
      return Cookies.set(key, value)
    }
  }

}

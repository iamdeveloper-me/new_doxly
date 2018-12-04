import Cookies from 'js-cookie'
import Promise from 'promise-polyfill' // polyfill Promises because they aren't supported in IE11
if (!window.Promise) {
  window.Promise = Promise
}
import 'whatwg-fetch'

const Api = {
  get: function(url) {
    return fetch(`${this._baseUrl}${url}`, {
      method: 'GET',
      headers: this._setAuthHeaders()
    })
    .then(this._parseJSON)
    .then(this._checkStatus)
    .then(this._getData)
  },

  post: function(url, data) {
    return fetch(`${this._baseUrl}${url}`, {
      method: 'POST',
      headers: this._setAuthHeaders(),
      body: JSON.stringify(data)
    })
    .then(this._parseJSON)
    .then(this._checkStatus)
    .then(this._getData)
  },

  put: function(url, data) {
    return fetch(`${this._baseUrl}${url}`, {
      method: 'PUT',
      headers: this._setAuthHeaders(),
      body: JSON.stringify(data)
    })
    .then(this._parseJSON)
    .then(this._checkStatus)
    .then(this._getData)
  },

  delete: function(url) {
    return fetch(`${this._baseUrl}${url}`, {
      method: 'DELETE',
      headers: this._setAuthHeaders()
    })
    .then(this._parseJSON)
    .then(this._checkStatus)
    .then(this._getData)
  },

  upload: function(url, file) {
    let formData = new FormData()
    formData.append('file', file)
    const authCookie = this._getAuthCookie()
    return fetch(`${Api._baseUrl}${url}`, {
      method: 'POST',
      headers: new Headers({
        'X-User-Token': authCookie.token,
        'X-User-Email': authCookie.email,
        'X-Entity-User-Id': authCookie.entity_user_id
      }),
      body: formData
    })
    .then(Api._parseJSON)
    .then(Api._checkStatus)
    .then(Api._getData)
  },

  getFile: function(url) {
    return fetch(`${this._baseUrl}${url}`, {
      headers: this._setAuthHeaders()
    })
    .then(this._parseBlob)
  },

  _baseUrl: ($('body').data('api-url') || "") + "/v1",
  _refreshApiAuthenticationUrl: `${window.location.protocol}//${window.location.host}/refresh_api_auth`,

  _getAuthCookie: function() {
    let authCookie = Cookies.getJSON('authentication')
    if (!authCookie) {
      fetch(this._refreshApiAuthenticationUrl, {
        method: 'GET'
      })
      .then(function() {
        authCookie = Cookies.getJSON('authentication')
      })
    }
    return authCookie
  },

  _setAuthHeaders: function() {
    const authCookie = this._getAuthCookie()
    return new Headers({
      'Content-Type': 'application/json',
      'X-User-Token': authCookie.token,
      'X-User-Email': authCookie.email,
      'X-Entity-User-Id': authCookie.entity_user_id
    })
  },

  _checkStatus: function(json) {
    if (json.status >= 200 && json.status < 300) {
      return json
    } else {
      throw json
    }
  },

  _parseJSON: function(response) {
    return response.json()
  },

  _parseBlob: function(response) {
    return response.blob()
  },

  _getData: function(json) {
    return json.data
  }
}
export default Api

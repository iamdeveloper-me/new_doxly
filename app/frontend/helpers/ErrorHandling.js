import _ from 'lodash'
const ErrorHandling = {

  _reactDebugMode: function(){
    return 'false'
  },

  setErrors: (error, callback = null) => {
    try {
      if (ErrorHandling._reactDebugMode() === 'true'){
        console.log(error)
      }
      _.each(error.messages.errors, error => App.FlashMessages.addMessage('error', `Error: ${error}`))
      if (callback) {
        callback()
      }
    }
    catch(e) {
      App.FlashMessages.addMessage('error', 'The previous action could not be completed successfully. Please reload the page.')
      if (typeof Rollbar !== 'undefined') {
        Rollbar.error("Error Handling caught an error", e)
      }
    }
  }
}
export default ErrorHandling

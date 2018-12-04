App.FlashMessages = {

  addMessage: function(type, message) {
    const alert_type = type
    if (alert_type == "notice") {
      type = "info"
    }
    else if (alert_type == "alert") {
      type = "warning"
    }
    else if (alert_type == "error") {
      type = "danger"
    }
    const message_object = $('<div></div>').addClass(`alert alert-${type} alert-dismissible fade in`).html(message)
    $('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>').appendTo(message_object)
    message_object.appendTo($('.flash-container'))

    const time = message.length*100
    App.FlashMessages.bindAlertTimer(time > 5000 ? time : 5000) // longer messages should be shown for longer, we can adjust this constant as needed
  },

  bindAlertTimer: function(length = 5000) {
    setTimeout(function() {
      $('.alert-dismissible').fadeOut("slow", function() {
        $(this).remove();
      });
    }, length);
  }
}

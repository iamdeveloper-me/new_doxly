App.Modal = {

  initialize: function() {
    App.Modal.bindForms()
    App.Modal.bindSlidingPaneForms()
    App.Helpers.initialize()
    App.Forms.enableInputs('.modal-content')
    App.SearchFilter.initialize()
    App.Deals.bindDealEmail()
  },

  bindForms: function() {
    const modalContent = $('.modal-content')
    modalContent.find('input[type=submit]').attr('disabled', false);
    modalContent.find('.cancel-form').attr('disabled', false);
    App.Helpers.delay(function() {
      $('.submit-form').off('click')
      $('.submit-form').on('click', function(e) {
        modalContent.find('input[type=submit]').attr('disabled', true);
        modalContent.find('.cancel-form').attr('disabled', true);
        const form = modalContent.find('form')
        form.unbind('submit')
        if (form.hasClass('no-turboboost')) {
          form.ajaxSubmit({dataType: 'script'})
        } else {
          form.submit()
        }
        form.bind('submit')
      })
      $('.cancel-form').off('click')
      $('.cancel-form').on('click', function(e) {
        const path = $(this).attr('path')
        if (path) {
          $.getScript(`${$(this).attr('path')}`)
        }
      })
    }, 300)
  },

  bindClipboard: function(clipboard) {
    clipboard.off('success')
    clipboard.on('success', function(e) {
      App.FlashMessages.addMessage("success", "The packet link has been copied to your clipboard")
    });

    clipboard.off('error')
    clipboard.on('error', function() {
      App.FlashMessages.addMessage("error", "Could not copy the packet link to your clipboard. Please try again.")
    });
  },

  bindSlidingPaneForms: function() {
    const paneContent = $('.pane-content')
    paneContent.find('input[type=submit]').attr('disabled', false);
    paneContent.find('.cancel-pane-form').attr('disabled', false);
    App.Helpers.delay(function() {
      $('.submit-pane-form').off('click')
      $('.submit-pane-form').on('click', function(e) {
        paneContent.find('input[type=submit]').attr('disabled', true);
        paneContent.find('.cancel-pane-form').attr('disabled', true);
        const form = paneContent.find('form')
        form.unbind('submit')
        if (form.hasClass('no-turboboost')) {
          form.ajaxSubmit({dataType: 'script'})
        }
        else {
          form.submit()
        }
        form.bind('submit')
      })

      $('.cancel-pane-form').off('click')
      $('.cancel-pane-form').on('click', function(e) {
        paneContent.find('input[type=submit]').attr('disabled', true);
        paneContent.find('.cancel-pane-form').attr('disabled', true);
        $('#sliding-pane').find('.pane-content').slideUp('fast').html('')
        $('#modal-blocker').fadeOut('fast');
      })
    }, 300)
  },

  show: function(html, focus=true) {
    let lastModalScrollTop = 0
    let clipboard = new Clipboard('.clipboard-btn')
    $('#modal').html(html)
    $('#modal')
    .modal({show: true, backdrop: 'static'})
    .one('hidden.bs.modal', function() {
      let persistContent = $('#modal .modal-dialog').data('persist-content')
      if (persistContent == true) {
        $('body').trigger('modal.closed.complete')
      } else {
        $(this).html('')
      }
      clipboard.destroy()
    })
    .one('shown.bs.modal', function() {
      App.Forms.performFormFocus($('#modal'), focus)
      App.Modal.bindClipboard(clipboard)
    })
    .scroll(function() {
      if ($("ul.ui-autocomplete", "body").is(':visible')) {
        const autocompleteList = $("ul.ui-autocomplete:visible", "body")
        const modalScrollTop = $(this).scrollTop()
        autocompleteList.offset({
          top: autocompleteList.offset().top - (modalScrollTop - lastModalScrollTop)
        })
        lastModalScrollTop = modalScrollTop
      }
    })
    App.Modal.initialize()
  },

  showSlidingPane: function(html) {
    $('#modal-blocker').fadeIn('fast');
    $('#sliding-pane').html(html).find('.pane-content').slideDown('fast')
    App.Modal.initialize()
  },

  setBody: function(html) {
    $('.modal-body').html(html)
  },

  setPaneBody: function(html) {
    $('.pane-body').html(html)
  },

  hideSlidingPane: function() {
    $('#sliding-pane').find('.pane-content').slideUp('fast').html('')
    $('#modal-blocker').fadeOut('fast')
  },

  hide: function() {
    $('#modal').modal('hide')
  }

}

$(document).on('turboboost:complete', function() {
  App.Modal.initialize()
})

App.SignatureTabs = {

  initialize: function() {
    App.SignatureTabs.bindTagsSubmitClick()
    App.SignatureTabs.bindModalClose()
  },

  signatureTabsArray: [],

  removedTabsIds: [],

  signature_tab_details: {
    "Signature": {
      "Signature": {
        class: 'sign',
        text: 'Sign'
      }
    },
    "Text": {
      "Full Name": {
        class: 'name',
        text: 'Name'
      },
      "Title": {
        class: 'title',
        text: 'Title'
      },
      "Address Line": {
        class: 'address-line',
        text: 'Address Line'
      }
    },
    "DateSigned": {
      "Date Signed": {
        class: 'date-signed',
        text: 'Date Signed'
      }
    }
  },

  new: function(draggingTabHTML, label, tabType){
    $('#dragging-tab').remove()
    const signaturePage = $('.custom-signature-page')

    // add the dragging element.
    signaturePage.append(draggingTabHTML)
    signaturePage.bind('mousemove', function(e){
      let dragX = (e.pageX - $(this).offset().left)
      const dragY = (e.pageY -$(this).offset().top)
        $('#dragging-tab').css({
         left:  dragX,
         top:   dragY
      })
    })
    signaturePage.off('click').on('click', function(e) {
        // find the relative left and top values of the click.
        const posX = (e.pageX - $(this).offset().left)
        const posY = (e.pageY -$(this).offset().top);
        let id = Math.floor(Math.random() * 100000000000)
        let typeClass = App.SignatureTabs.signature_tab_details[tabType][label].class
        let text = App.SignatureTabs.signature_tab_details[tabType][label].text

        // create a div with

        let permanentTab = $('<div>',
          {
            class: `signature-tab ${typeClass}`,
            id: id,
            append: $('<div>',
              {
                text: text,
                class: 'tab-text'
              }
            ),
            prepend: $('<span>',
              {
                class: 'fa fa-times-circle remove-tab',
                'data-remote': 'true',
                'click': function()
                  {
                    let parentTab = $(this).closest('.signature-tab')
                    // remove from the signatureTabsArray
                    App.SignatureTabs.signatureTabsArray = App.SignatureTabs.signatureTabsArray.filter(function(obj) {return obj.id !== parseInt(parentTab.attr('id')) })
                    parentTab.remove()
                  }
              }
            )
          }
        )

        // set the position of the permanent tab.
        permanentTab.css({
          left: `${posX}px`,
          top: `${posY}px`
        })
        // place the permanent tab.
        $(this).append(permanentTab)

        // remove the hover element.
        $('#dragging-tab').remove()

        // Remove all the event listeners on element to force clicking on tab button again.
        $(this).off()

        // add the object to the signatureTabs array
        App.SignatureTabs.signatureTabsArray.push({id: id, label: label, tab_type: tabType, x_coordinate: posX, y_coordinate: posY})
    })
  },

  remove: function(signatureTabId) {
    App.SignatureTabs.removedTabsIds.push(signatureTabId)
    $(`#signature-tab-${signatureTabId}`).remove()
  },

  bindTagsSubmitClick: function(){
    $('.submit-signature-tabs').off('click').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault() // Prevent link from following its href
      const url = $(this).attr('href')
      let data = new FormData()
      data.append("signature_tabs", JSON.stringify(App.SignatureTabs.signatureTabsArray))
      data.append("removed_tabs_ids", JSON.stringify(App.SignatureTabs.removedTabsIds))
      $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'script',
        contentType: false,
        processData: false
      })
    })
  },

  bindModalClose: function(){
    $('.custom-signature-page-modal').closest('#modal').on('hidden.bs.modal', function () {
      App.SignatureTabs.signatureTabsArray = []
      App.SignatureTabs.removedTabsIds = []
    })
  }

}

$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {
  App.SignatureTabs.initialize()
});

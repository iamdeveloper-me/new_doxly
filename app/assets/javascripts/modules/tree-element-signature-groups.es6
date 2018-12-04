App.TreeElementSignatureGroups = {

  initialize: function() {
    App.TreeElementSignatureGroups.toggleAlias()
    App.TreeElementSignatureGroups.alias()
  },

  update: function(signatureGroupsColumnHTML, signatureGroupId, signaturePageHTML, actionUpdate){
    if (actionUpdate == "true"){
      App.Modal.hide()
    }
    $('#signature-groups').replaceWith(signatureGroupsColumnHTML)
    $('#signature-page').replaceWith(signaturePageHTML)
    if (signatureGroupId){
      $(`#add-signature-group-${signatureGroupId} .add-button`).html("Added")
      $(`#signature-group-${signatureGroupId} .signature-group-header`).addClass('signature-group-active')
    }
    App.Toggles.initialize()
  },

  toggleAlias: function() {
    $('#show-group-name-checkbox').off('change').one('change', function(e) {
      $(this).closest('.group-container').find('.alias-container').toggleClass('hidden')
      $.getScript(`${$(this).data('path')}?checked=${this.checked}`)
    })
  },

  alias: function() {
    $('#tree_element_signature_group_alias').one('focus', function(e) {
      $(this).closest('.form-group').find('.submit-buttons').removeClass('hidden')
      App.TreeElementSignatureGroups.alias()
    })
    $('#cancel-change-alias').one('click', function(e) {
      $(this).closest('.submit-buttons').addClass('hidden')
    })
  }

}

$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {
  App.TreeElementSignatureGroups.initialize()
});

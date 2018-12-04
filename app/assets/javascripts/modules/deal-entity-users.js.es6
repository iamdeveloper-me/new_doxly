App.DealEntityUsers = {

  initialize: function() {
    App.DealEntityUsers.bindPeopleSearch()
    App.DealEntityUsers.bindDisableInputs()
    App.DealEntityUsers.bindAlterCreateEntityPath()
    App.DealEntityUsers.bindSendCheckbox()
  },

  bindPeopleSearch: function() {
    $('#people_search').unbind('input')
    $('#people_search').bind('input', function(e) {
      const query = e.target.value;
      const searchTree = [{
        container: "panel-deals-full",
        data: "deals-full-group__header",
        children: [{
          container: "project-item",
          data: "item-body"
        }]
      }];
      performNestedSearch(query, searchTree, $('.people-list'), false);
    });
  },

  bindAlterCreateEntityPath: function(){
    $('#is-counsel-selectpicker').on('changed.bs.select', function(e){
      if ($('.connect-button').attr('href').split('entity%5Bis_counsel%5D=false').length > 1){
        const new_href = $('.connect-button').attr('href').split('entity%5Bis_counsel%5D=false').join(`entity%5Bis_counsel%5D=${e.target.value}`)
        $('.connect-button').attr('href', new_href)
      }else if ($('.connect-button').attr('href').split('entity%5Bis_counsel%5D=true').length > 1){
        const new_href = $('.connect-button').attr('href').split('entity%5Bis_counsel%5D=true').join(`entity%5Bis_counsel%5D=${e.target.value}`)
        $('.connect-button').attr('href', new_href)
      }
    })
  },

  bindDisableInputs: function() {
    $('.entity-connection-selectpicker').on('change', function() {
      if ($(this).val()) {
        $('.new-entity-connection :input').attr('disabled', true);
      } else {
        $('.new-entity-connection :input').attr('disabled', false);
      }
    })

    $('.new-entity-connection :input').on('change', function() {
      if($(this).val()) {
        $('.entity-connection-selectpicker').attr('disabled', true);
      } else {
        $('.entity-connection-selectpicker').attr('disabled', false);
      }
    })
  },

  update: function(companyHTML, dealEntityId, roleId, entityUserId) {
    $(`.add-entity-item.org_user_${entityUserId}`).html('Added')
    $(`#role-${roleId} #deal-org-${dealEntityId}`).replaceWith(companyHTML)
  },

  destroy: function(companyHTML, roleId, dealEntityId) {
    $(`#role-${roleId} #deal-org-${dealEntityId}`).replaceWith(companyHTML)
  },

  destroyDealEntity: function(dealEntityHTML, dealEntityId) {
    $(`.modal-body .deal-org-outer-${dealEntityId}`).remove()
  },

  updateDealEntity: function(roleHTML, entityId, roleId) {
    if ($(`.add-entity-item.org_${entityId}`).length > 0){
      $(`.connect-button-${entityId}`).html("Added")
    } else{
      $(`.add-entity-item .new-party`).html('Added')
    }
    $(`#role-${roleId}`).replaceWith(roleHTML)
  },

  createEntityConnection: function(partial, entityId, cssClass) {
    if ($(`.add-entity-item.org_${entityId}`).length > 0){
      $(`.connect-button-${entityId}`).html("Connected")
    }
    else{
      $(`.add-entity-item .${cssClass}`).html('Created And Connected')
      }
    $('#deal-entity-users-list').prepend(partial)
  },

  bindSendCheckbox: function(){
    $('#send-checkbox input[type="checkbox"]').on('change', function(){
      const status = $(this).is(':checked')
      if($(this).is(':checked')) {
        $('#message-box').removeClass('hidden')
      } else {
        $('#message-box').addClass('hidden')
      }
    })
  }
}

$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {
  App.DealEntityUsers.initialize()
});

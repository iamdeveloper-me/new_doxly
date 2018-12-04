App.Roles = {

  initialize: function() {
    App.Roles.bindRoleSearch()
    App.LocalStorage.restoreOpenState()
    App.Roles.bindDeleteSelector()
  },

  bindRoleSearch: function() {
    $('#role_search').unbind('input')
    $('#role_search').bind('input', function(e) {
      const query = e.target.value;
      const searchTree = [{
        container: "role-group",
        data: "role-group__header",
        children: [
          {
            container: "entity-group",
            data: "entity-details",
            children: [
              {
                container: "user-role",
                data: "info"
              }
            ]
          },
          {
            container: 'individual',
            data: 'individual-role'
          }
        ]
      }];
      performNestedSearch(query, searchTree, $('#role-list'), false);
    });
  },

  create: function(roleHTML, roleId) {
    App.Modal.hide()
    $('.content-single').append(roleHTML)
    $(`#role-${roleId}`).addClass('expanded')
    $("body").animate({ scrollTop: $(document).height() }, 2000)
  },

  update: function(roleHTML, roleId) {
    App.Modal.hide()
    $(`#role-${roleId}`).replaceWith(roleHTML)
  },

  bindDeleteSelector: function(){
    $('.wgl-delete').on('click', function(e){
      const selector = $(e.target)
      selector.addClass('wgl-delete-on-click')
      $(document).mouseup(function(e) {
        // if the target of the click isn't the container nor a descendant of the container
        if (!selector.is(e.target) && selector.has(e.target).length === 0) {
          selector.removeClass('wgl-delete-on-click')
        }
      })
    })
  }

}

$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {
  App.Roles.initialize()
});

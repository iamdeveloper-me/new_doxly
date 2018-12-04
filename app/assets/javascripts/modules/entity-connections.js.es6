App.EntityConnections = {

  initialize: function() {
    App.EntityConnections.bindPeopleSearch()
  },

  bindPeopleSearch: function() {
    $('#entity-connections-search').unbind('input')
    $('#entity-connections-search').bind('input', function(e) {
      const query = e.target.value;
      const searchTree = [{
        container: "deal-entity-user-group",
        data: "deal-entity-user-group__header",
        children: [{
          container: "deal-entity-user",
          data: "details"
        }]
      }];
      performNestedSearch(query, searchTree, $('#deal-entity-users-list'), false);
    });
  }
}
$(document).on('turbolinks:load', function() {
  App.EntityConnections.initialize()
});

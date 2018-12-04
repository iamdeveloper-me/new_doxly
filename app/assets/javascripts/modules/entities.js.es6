App.Entities = {

  initialize: function() {
    App.Entities.bindPeopleSearch()
  },

  bindPeopleSearch: function() {
    $('#team-members-search').unbind('input')
    $('#team-members-search').bind('input', function(e) {
      const query = e.target.value;
      const searchTree = [{
        container: "team-list-item",
        data: "details"
      }];
      performNestedSearch(query, searchTree, $('.team-list'), false);
    });
  }
}
$(document).on('turbolinks:load', function() {
  App.Entities.initialize()
});

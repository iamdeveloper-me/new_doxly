App.DealTemplates = {

  initialize: function() {
    App.DealTemplates.bindTemplatesSearch()
  },

  bindTemplatesSearch: function() {
    $('#templates_search').bind('input', function(e) {
      var query = e.target.value;
      var searchTree = [{
        container: "template",
        data: "title"
      }];
      performNestedSearch(query, searchTree, $('.template-grid'), false)
    })
  },

  create: function(dealTemplatesHTML) {
    App.Modal.setBody(dealTemplatesHTML)
    App.Modal.hideSlidingPane()
  },

  destroy: function(dealTemplatesHTML) {
    App.Modal.setBody(dealTemplatesHTML)
  },

  apply: function(searchFilterHTML, treeHTML) {
    App.Modal.hide()
    $('#search-filter').html(searchFilterHTML)
    $('#category-tree').html(treeHTML)
    App.Deals.initialize()
    App.Toggles.bindToggle()
    App.Toggles.toggleSearchView()
  }

}

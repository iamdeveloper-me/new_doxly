App.SearchFilter = {

  initialize: function() {
    App.SearchFilter.bindFilterClick();
    App.SearchFilter.bindSearchInput();
  },

  bindFilterClick: function() {
    $('.dropdown-menu-item').off('click').on('click', function(e) {
      App.SearchFilter.prepareFilterChange(this)
    })
  },

  bindSearchInput: function() {
    $('[data-search-path]').not('.no-server').off('keyup').on('keyup', $.debounce(250, function(e) {
      App.Helpers.delay(App.SearchFilter.prepareSearchTextChange.bind(this), 100)
    }))
  },

  prepareFilterChange: function(context) {
    let filterInfo
    let sortInfo
    if ($(context).closest('#dropdown-menu-show').size() > 0 ) {
      $(context).closest('div#dropdown-menu-show').find('.dropdown-menu-item i').removeClass('fa-check').addClass('fa-fw')
      $(context).find('i').removeClass('fa-fw').addClass('fa-check')
    }
    else if ($(context).closest('#dropdown-menu-sorted-by').size() > 0) {
      $(context).closest('div#dropdown-menu-sorted-by').find('.dropdown-menu-item i').removeClass('fa-check').addClass('fa-fw')
      $(context).find('i').removeClass('fa-fw').addClass('fa-check')
    }

    if ($(context).closest('#dropdown-menu-show').size() > 0 ) {
      const sortMenuItem = $('#dropdown-menu-sorted-by').find('.dropdown-menu-item > i.fa-check').parent()
      filterInfo = App.SearchFilter.getFilterInfo($(context))
      sortInfo = App.SearchFilter.getSortInfo(sortMenuItem)
    }
    else if ($(context).closest('#dropdown-menu-sorted-by').size() > 0) {
      const filterMenuItem = $('#dropdown-menu-show').find('.dropdown-menu-item > i.fa-check').parent()
      filterInfo = App.SearchFilter.getFilterInfo(filterMenuItem)
      sortInfo = App.SearchFilter.getSortInfo($(context))
    }

    let title
    let documentFilterTitle
    if (filterInfo) {
      if (sortInfo) {
        title = `${filterInfo.title} by ${sortInfo.title}`
      }
      documentFilterTitle = filterInfo.title
    }
    if (title) {
      $('.search-filter.dropdown-filter > .dropdown-toggle').html(title)
    }
    if (documentFilterTitle) {
      $('.search-filter.dropdown-filter > .document-filter').html(documentFilterTitle)
    }

    const filterField = $('#dropdown-menu-show').find('.dropdown-menu-item > i.fa-check').parent().data('filter-field')
    if($('#document-list').is(":checked")) {
      App.SearchFilter.removeDocumentsListFilter()
      App.SearchFilter.documentListFilter(filterField)
      App.Toggles.hideSidebarIfNoDocuments()
    } else if ($('#checklist').is(":checked")) {
      App.SearchFilter.removeChecklistFilter()
      App.SearchFilter.checklistFilter(filterField)
      App.Toggles.hideSidebarIfNoSections()
    } else if (filterInfo && sortInfo) {
      App.SearchFilter.runSearch(filterInfo.field, filterInfo.value, sortInfo.field)
    }
  },

  prepareSearchTextChange: function(context) {
    const filterMenuItem = $('#dropdown-menu-show').find('.dropdown-menu-item > i.fa-check').parent()
    const sortMenuItem = $('#dropdown-menu-sorted-by').find('.dropdown-menu-item > i.fa-check').parent()
    const filterInfo = App.SearchFilter.getFilterInfo(filterMenuItem)
    const sortInfo = App.SearchFilter.getSortInfo(sortMenuItem)
    App.SearchFilter.runSearch(filterInfo.field, filterInfo.value, sortInfo.field)
  },

  runSearch: function(filterField, filterFieldValue, sortField) {
    let filterText
    if ($('#sliding-pane .input-search').length > 0){
      filterText = $('#sliding-pane .input-search').val()
    } else if ($('#modal .input-search').length > 0) {
      filterText = $('#modal .input-search').val()
    } else {
      filterText = $('.input-search').val()
    }
    filterText = encodeURIComponent(filterText)
    const searchPath = App.SearchFilter.getSearchPath()
    let separator
    if (searchPath) {
      if (searchPath.indexOf('?') >= 0) {
        separator = "&"
      } else {
        separator = "?"
      }
      if (filterField) {
        $.getScript(`${searchPath}${separator}filter_text=${filterText}&filter_field=${filterField}&filter_field_value=${filterFieldValue}&sort_field=${sortField}`)
      } else {
        $.getScript(`${searchPath}${separator}filter_text=${filterText}`)
      }
    }
  },

  getSearchPath: function() {
    // So that the highest z-index search is actually the one being selected.
    if ($('#sliding-pane .search-input-box').length > 0){
      return $('#sliding-pane .search-input-box').data('search-path')
    }
    else if ($('#modal .search-input-box').length > 0) {
      return $('#modal .search-input-box').data('search-path')
    }
    else {
      return $('.search-input-box').data('search-path')
    }
  },

  getFilterInfo: function(element) {
    const result = {}
    result.title = element.attr('title')
    result.field = element.data('filter-field')
    result.value = element.data('filter-field-value')
    return result
  },

  getSortInfo: function(element) {
    const result = {}
    result.title = element.attr('title')
    result.field = element.data('sort-field')
    return result
  }

}

$(document).on('turbolinks:load', function() {
  App.SearchFilter.initialize()
});

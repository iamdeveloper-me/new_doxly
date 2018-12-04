App.ClosingBook = {

  initialize: function() {
    App.ClosingBook.bindCreateWizard()
    App.ClosingBook.bindCheckSections()
    App.ClosingBook.bindEachCheck()
  },

  bindCheckSections: function() {
    $('input[name="select-all"]').on('change', function(){
      const status = $(this).is(':checked')
      $('input[type="checkbox"]:enabled', $(this).parents().eq(2)).prop('checked', status)
    })
  },

  bindEachCheck: function() {
    $('.document-checkbox input[type="checkbox"]').on('change', function(){
      const status = $(this).is(':checked')
      const checkedSiblings = $(this).closest('ul').find('input:checked')
      const siblings = $(this).closest('ul').find('input:enabled')
      const parent = $(this).closest('.section-group').find('.section-checkbox input')
      parent.prop('checked', (checkedSiblings.length === siblings.length))
    })
  },

  updateCoverPageView: function(coverPageHTML) {
    $("#cover-page").html(coverPageHTML)
  },

  bindCreateWizard: function(){
    $("#closing-book").steps({
      headerTag: "h3",
      bodyTag: "section",
      transitionEffect: "slideLeft",
      autoFocus: true,
      enablePagination: parseInt($("#closing-book").data('document-count')) > 0,
      onInit: function () {
        bindClosingBookTooltip('.has-closing-book-tooltip')
      },
      onFinished: function () {
        $("#closing-book").submit()
      }
    })
  }
}
$(document).on('turbolinks:load', function() {
  if ($("#tab-deal-closing-book").length > 0) {
    App.Helpers.clearTurbolinksCache()
  }
  App.ClosingBook.initialize()
});

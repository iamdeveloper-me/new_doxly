App.SignaturePage = {

  initialize: function() {
    App.SignaturePage.bindTreeElementSelect()
    App.SignaturePage.bindSignatureGroupSelect()
    App.SignaturePage.bindSignatureUserSelect()
    App.SignaturePage.updateFooterName()
    App.SignaturePage.toggleFooterPreview()
    App.SignaturePage.updateHeaderText()
    App.SignaturePage.toggleHeaderPreview()
    App.SignaturePage.toggleAddress()
    App.SignaturePage.toggleDateSigned()
    App.SignaturePage.bindUpdateSignaturePageCopies()
    App.SignaturePage.bindDocumentSearch()
    App.SignaturePage.bindHideAndShowColumns()
    App.SignaturePage.bindDocumentPageThumbnails()
  },

  bindDocumentPageThumbnails: function() {
    $('.choose-from-document-thumbnail-container').off('click').on('click', function() {
      // reset
      const reset_title_value = "Select this page"
      $('.choose-from-document-thumbnail-container').removeClass('selected')
      $('.choose-from-document-thumbnail-container').find('img').attr({alt: reset_title_value, title: reset_title_value})
      // do select
      const title_value = "Unselect this page"
      $('.choose-from-document-container').find('input[name="page"]').val($(this).data('page'))
      $(this).toggleClass('selected')
      $(this).find('img').attr({alt: title_value, title: title_value})
    })

    $('.choose-from-document-thumbnail-container .mdi-eye').off('click').on('click', function(e) {
      $.getScript($(this).data('url'))
      App.Helpers.stopPropagation(e)
    })
  },

  bindTreeElementSelect: function() {
    $('.signature-tree-element').off('click').on('click', function() {
      $('.signature-tree-element-active').removeClass('signature-tree-element-active')
      $(this).addClass('signature-tree-element-active')
      $.getScript($(this).attr('path'))
    })
  },

  bindSignatureGroupSelect: function() {
    $('.signature-group-header').off('click').on('click', function() {
      $('.signature-group-active').removeClass('signature-group-active')
      $('.signature-group-user-active').removeClass('signature-group-user-active')
      $(this).addClass('signature-group-active')
      $.getScript($(this).attr('path'))
    })
  },

  bindSignatureUserSelect: function() {
    $('.signature-group-user').off('click').on('click', function() {
      $('.signature-group-user-active').removeClass('signature-group-user-active')
      $('.signature-group-active').removeClass('signature-group-active')
      $(this).addClass('signature-group-user-active')
      $.getScript($(this).attr('path'))
    })
  },

  updateSignatureGroupsView: function(signatureGroupHTML) {
    $("#signature-groups").html(signatureGroupHTML)
    App.Toggles.initialize()
    bindExcludedTooltip('.has-excluded-tooltip')
  },

  updateSigningCapacity: function(signingCapacityId, signingCapacityHTML) {
    $(`#signature-group-user-${signingCapacityId}`).replaceWith(signingCapacityHTML)
    App.Toggles.initialize()
  },

  updateSignaturePageView: function(signaturePageHTML) {
    $("#signature-page").html(signaturePageHTML)
    App.Toggles.initialize()
    App.TreeElementSignatureGroups.initialize()
    $('.selectpicker').selectpicker()
  },

  updateSignatureEntity: function(signatureEntityId, signatureEntityHTML) {
    $(`#signature-entity-${signatureEntityId}`).replaceWith(signatureEntityHTML)
    App.Toggles.initialize()
  },

  updateSignaturePageEntityView: function(signaturePageEntityHTML) {
    $("#signature-page-entity").html(signaturePageEntityHTML)
    App.Toggles.initialize()
    App.TreeElementSignatureGroups.initialize()
    $('.selectpicker').selectpicker()
  },

  voidSignaturePacket: function(signatureGridHTML) {
    App.Modal.hide()
    $('#signature-packet-grid').html(signatureGridHTML)
  },

  updateFooterName: function() {
    $('.footer-input').off('keyup').on('keyup', function(){
        $('#footer-tree-element').html($('.footer-input').val().toUpperCase());
    })
  },

  toggleFooterPreview: function() {
    $('#show-footer-checkbox').off('change').one('change', function(e) {
      $(this).closest('.footer-container').find('.preview').toggleClass('hidden')
      $.getScript(`${$(this).data('path')}?checked=${this.checked}`)
    })
  },

  updateHeaderText: function() {
    $('.header-input').off('keyup').on('keyup', function(){
        $('#header-tree-element').html($('.header-input').val());
    })
  },

  toggleHeaderPreview: function() {
    $('#show-header-checkbox').off('change').one('change', function(e) {
      $(this).closest('.header-container').find('.preview').toggleClass('hidden')
      $.getScript(`${$(this).data('path')}?checked=${this.checked}`)
    })
  },

  toggleAddress: function() {
    $('#show-address-checkbox').off('change').one('change', function(e) {
      $.getScript(`${$(this).data('path')}?checked=${this.checked}`)
    })
  },

  toggleDateSigned: function() {
    $('#show-date-signed-checkbox').off('change').one('change', function(e) {
      $.getScript(`${$(this).data('path')}?checked=${this.checked}`)
    })
  },

  bindUpdateSignaturePageCopies() {
    $('.selectpicker').selectpicker({
      dropupAuto: false
    });
    $('#document_number_of_signature_page_copies').off('changed.bs.select').one('changed.bs.select', function () {
      $(this).closest('form').submit()
    });
  },

  bindDocumentSearch: function() {
    $('#signature-pages-search').unbind('input')
    $('#signature-pages-search').bind('input', function(e) {
      const query = e.target.value;
      const searchTree = [{
        container: "signature-tree-element",
        data: "tree-element-names"
      }];
      performNestedSearch(query, searchTree, $('.column-container-left'), false);
    });
  },

  bindHideAndShowColumns: function() {
    $(".signature-tree-element").on("hide", function(e) {
      const element = $(e.target)
      if(element.hasClass('signature-tree-element-active')) {
        element.removeClass('signature-tree-element-active')
        $('.column-container-middle').html('<div class="empty-state">Select a document to manage signature groups</div>')
        $('.column-container-right').html('<div class="empty-state">Select a document, group or individual to view more details</div>')
      }
    })
  },

  refreshThumbnails: function(html) {
    $('.choose-from-document-thumbnails').html(html)
  }
}

$(document).on('turbolinks:load ajaxComplete ajaxSuccess', function() {
  App.SignaturePage.initialize()
});

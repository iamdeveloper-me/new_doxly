App.SignaturePackets = {

  initialize: function(){
    App.MobileMenu.initialize()
    App.SignaturePackets.bindDocumentClick()
    App.SignaturePackets.bindSelectDocument()
    App.SignaturePackets.bindSignatureTypeCheckboxes()
    App.SignaturePackets.bindUploadButton()
  },

  bindDisableSend: function(){
    const disabled = $('#signature-packet-submit').attr('data-disabled') === "true"
    if (disabled) {
      $('#signature-packet-submit').prop('disabled', 'disabled')
    }
  },

  bindDocumentClick: function(){
    $('.document').off('click').on('click', function(e){
      $('.selected').removeClass('selected')
      $(this).addClass('selected')
      $('#document-selector').selectpicker('val', $('.document.selected').closest('a').attr('href'))
    })
  },

  bindSelectDocument() {
    $('#document-selector').on('changed.bs.select', function (e, index, oldValue, newValue) {
      const url = $(this).val()[0]
      const regex = /(tree_element_id=)(.*)(&)/i
      $('.document.selected').removeClass('selected')
      $(`.document.document-viewer-${url.match(regex)[2]}`).addClass('selected')
      $.getScript(url)
    });
  },

  bindUploadButton: function(){
    $('.js-upload-file').off('click').on('click', function(){
      const form = $(this).closest('form')
      form.unbind('submit')
      form.ajaxSubmit({dataType: 'script'})
    })
  },

  bindSignatureTypeCheckboxes: function() {
    $('.signature-type-checkbox').change(function(e) {
      App.SignaturePackets.toggleSignatureType(this)
      $.getScript(`${$(this).attr('path')}?type=${this.value}`)
    })
  },

  toggleSignatureType: function(element) {
    element.checked = true
    const matchingCheckboxes = $(`.${$(element).attr('class').split(' ').join('.')}`)
    for(let i = 0; i < matchingCheckboxes.length; i++) {
      if(matchingCheckboxes[i] === element) {
        continue
      }
      matchingCheckboxes[i].checked = false
    }
  },

  viewDocument: function(iframeHTML){
    $('.document-viewer').html(iframeHTML)
  },

  findPacket: function(anchor) {
    const element = $(`#${anchor}`)
    if (element.offset().top > 100 || ($(`#${anchor}`).offset().top) < 50) {
      $('#page-wrapper').animate({
        scrollTop: (element.offset().top -80)
      }, 1000)
    }



    let rgb = element.css('background-color')

    // split into red green and blue array.
    let newRgb = rgb.split('(')[1].split(')')[0].split(',')
    let red = $.trim(newRgb[0])
		let green = $.trim(newRgb[1])
		let blue = $.trim(newRgb[2])

    // make 20% darker
    red = parseInt(red / (1.2))
		green = parseInt(green / (1.2))
		blue = parseInt(blue / (1.2))

    newRgb = `rgb(${red}, ${green}, ${blue})`
    element.css('background-color', newRgb)

    setTimeout(function() {
      element.css('background-color', rgb)
    }, 1500)
  },

  updateUploadProgress(id, batchId, fileName, signaturePacketId, imagePath, changeImage, i){
    setTimeout(function() {
      let percent = parseInt($(`#${id} .dz-upload`).css('width'))
      let pieChart = $(`#${id} .progress-circle`)
      pieChart.attr('data-progress', percent)
      if (percent === 100 && changeImage) {
        pieChart.remove()
        $(".dz-filename span").attr("title", fileName)
        $(`#${id} .left-box`).prepend(`<image src=${imagePath} class="upload-complete"></div>`)
        $(`#${id} .right-box`).prepend(`<a href="/signature_packets/${signaturePacketId}/delete_from_uploads_queue?filename=${encodeURIComponent(fileName)}&batch_id=${batchId}" data-method="delete" data-remote="true">Delete</a>`)
      } else {
        if (i < 300) {
          App.SignaturePackets.updateUploadProgress(id, batchId, fileName, signaturePacketId, imagePath, true, i++)
        }
      }
    }, 1000)
  },

  deleteFromUploadsQue: function(filename){
    $('.dz-filename span').filter(function () {
      let text = $(this).text()
      return text === filename
    }).closest('.file-upload').remove()
    if ($('.file-upload').length == 0) {
      if ($('.upload-submit-btn:visible').length > 0) {
        $('.upload-submit-btn').hide()
      }
      if ($('.upload-done-btn:hidden').length > 0) {
        $('.upload-done-btn').css('display', 'flex')
      }
    }
  },

  sendPacket: function(signingCapacityIds){
    const sguIds = JSON.parse(signingCapacityIds)
    $.each(sguIds, function(index, sguId){
      let selector = $(`.signature-group-user-${sguId}.not-sent`)
      selector.removeClass('not-sent')
      selector.addClass('sending')
      selector.find('span').text("Sending")
    })
  },

  sendPacketWizard: function(modalHtml){
    $('body').append(modalHtml)
  },

  voidPacket: function(signaturePageIds, hasManualPackets) {
    const spIds = JSON.parse(signaturePageIds)
    $.each(spIds, function(index, spId) {
      let selector = $(`.grid-cell.signature-page-${spId}`)
      selector.removeClass('sending awaiting-signature generating-link link-ready generating-download download-ready signed declined opened')
      selector.addClass('not-sent')
      selector.find('span').text("Not Sent")
      selector.find($('.threshold-met-subtext')).text('(Not Sent)')
    })
    App.React.FetchUnmatchedSignaturePagesData()
  },

  markAsSigned: function(signaturePageId) {
    let selector = $(`.grid-cell.signature-page-${signaturePageId}`)
    selector.removeClass('not-sent sending awaiting-signature generating-link link-ready generating-download download-ready declined opened')
    selector.addClass('signed')
    selector.find('span').text("Signed")
  },

  markAsAwaitingSignature: function(signaturePageId) {
    let selector = $(`.grid-cell.signature-page-${signaturePageId}`)
    selector.removeClass('not-sent sending generating-link link-ready generating-download download-ready signed declined opened')
    selector.addClass('awaiting-signature')
    selector.find('span').text("Awaiting Signature")
  },

  markAsLinkReady: function(signaturePageId) {
    let selector = $(`.grid-cell.signature-page-${signaturePageId}`)
    selector.removeClass('not-sent sending awaiting-signature generating-link generating-download download-ready signed declined opened')
    selector.addClass('link-ready')
    selector.find('span').text("Link Ready")
  },

  markAsDownloadReady: function(signaturePageId) {
    let selector = $(`.grid-cell.signature-page-${signaturePageId}`)
    selector.removeClass('not-sent sending awaiting-signature generating-link link-ready generating-download signed declined opened')
    selector.addClass('download-ready')
    selector.find('span').text("Download Ready")
  }
}

$(document).on('turbolinks:load', function() {
  App.Helpers.clearTurbolinksCache()
  App.SignaturePackets.initialize()
});

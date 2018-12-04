App.SignatureGrid = {
  remindSigner: function(tooltipId) {
    if (!$.trim($(`#${tooltipId} .timestamp`).html())){
      $(`#${tooltipId}`).closest('.tooltipster-show').height('+=18')
    }
    $(`#${tooltipId} .timestamp`).html('Just sent')
  }
}

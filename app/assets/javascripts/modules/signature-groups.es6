App.SignatureGroups = {

  importedFromWorkingGroup: function(temporaryUuid){
    App.React.FetchSignatureGroupsData()
    $(`.import-button-${temporaryUuid}`).html('Imported')
  },

  openImportWorkingGroupList(dealId, signatureGroupId) {
    $.getScript(`/deals/${dealId}/signature_groups/${signatureGroupId}/import_from_working_group`)
  }
  
}
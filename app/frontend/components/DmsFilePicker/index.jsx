import PropTypes from 'prop-types'
import React from 'react'

import { DMS_TYPES } from 'components/Category/CategoryContainer/index.jsx'
import { NetDocumentsFilePickerContainer } from 'components/DmsFilePicker/NetDocumentsFilePickerContainer/index.jsx'
import { SeeUnityImanageFilePickerContainer } from 'components/DmsFilePicker/SeeUnityImanageFilePickerContainer/index.jsx'
import { Imanage10FilePickerContainer } from 'components/DmsFilePicker/Imanage10FilePickerContainer/index.jsx'

const SAVE_AS_TYPES = {
  new_document: 'new_document',
  new_version: 'new_version'
}

const DmsFilePicker = ({dmsType, filePickerAction, treeElement, version, closeFilePicker, sendVersionToDms, uploadVersion}) => {

  switch(dmsType) {
    case DMS_TYPES.net_documents:
      return (
        <NetDocumentsFilePickerContainer
          filePickerAction={filePickerAction}
          version={version}
          closeFilePicker={closeFilePicker}
          uploadVersion={uploadVersion}
          treeElement={treeElement}
          sendVersionToDms={sendVersionToDms}
        />
      )
    case DMS_TYPES.see_unity_imanage:
      return (
        <SeeUnityImanageFilePickerContainer
          filePickerAction={filePickerAction}
          version={version}
          closeFilePicker={closeFilePicker}
          uploadVersion={uploadVersion}
          treeElement={treeElement}
          sendVersionToDms={sendVersionToDms}
        />
      )
    case DMS_TYPES.imanage10:
      return(
        <Imanage10FilePickerContainer
          filePickerAction={filePickerAction}
          version={version}
          closeFilePicker={closeFilePicker}
          uploadVersion={uploadVersion}
          treeElement={treeElement}
          sendVersionToDms={sendVersionToDms}
        />
      )
    default:
      return null
  }
}

DmsFilePicker.propTypes = {
  dmsType: PropTypes.string,
  filePickerAction: PropTypes.string,
  treeElement: PropTypes.object.isRequired,
  version: PropTypes.object,

  closeFilePicker: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

export { DmsFilePicker, SAVE_AS_TYPES }

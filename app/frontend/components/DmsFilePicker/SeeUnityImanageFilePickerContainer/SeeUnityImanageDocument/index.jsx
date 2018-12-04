import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Document from 'components/DmsFilePicker/FilePicker/ResourceList/Document/index.jsx'
import DocumentTypes from 'helpers/DocumentTypes'

export default class SeeUnityImanageDocument extends React.PureComponent {

  buildMetadata() {
    const { document } = this.props
    return [
      document.CreatedBy,
      moment(document.CreatedOn.replace('T', ' ')).local().format('DD/MM/YYYY, h:mma'),
      document.ModifiedBy,
      DocumentTypes.getDocumentNameString(document.Extension),
      _.find(document.Properties, { Field: 'imProfileDocNum' }).Value
    ]
  }

  buildDocumentObject(document) {
    return ({
      name: document.Name,
      extension: document.Extension.toLowerCase()
    })
  }

  render() {
    const { currentlySelectedDocumentEID, document, filePickerAction, saveAsType } = this.props
    const { getDocumentVersions } = this.props
    return (
      <Document
        document={this.buildDocumentObject(document)}
        filePickerAction={filePickerAction}
        metadata={this.buildMetadata()}
        getDocument={() => getDocumentVersions(document.EID)}
        isSelected={currentlySelectedDocumentEID === document.EID}
        saveAsType={saveAsType}
      />
    )
  }
}


SeeUnityImanageDocument.propTypes = {
  currentlySelectedDocumentEID: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
  filePickerAction: PropTypes.string.isRequired,
  saveAsType: PropTypes.string,

  getDocumentVersions: PropTypes.func.isRequired
}

import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Document from 'components/DmsFilePicker/FilePicker/ResourceList/Document/index.jsx'
import DocumentTypes from 'helpers/DocumentTypes'

export default class NetDocumentsDocument extends React.PureComponent {

  buildMetadata() {
    const document = this.props.document
    return [
      document.createdBy,
      moment(document.created).format('DD/MM/YYYY, h:mma'),
      document.modifiedBy,
      moment(document.modified).format('DD/MM/YYYY, h:mma'),
      DocumentTypes.getDocumentNameString(document.extension),
      document.id
    ]
  }

  render() {
    const { currentlySelectedDocumentEnvId, document, filePickerAction, saveAsType } = this.props
    const { getDocument } = this.props
    return (
      <Document
        document={document}
        filePickerAction={filePickerAction}
        metadata={this.buildMetadata()}
        getDocument={() => getDocument(document.envId)}
        isSelected={currentlySelectedDocumentEnvId === document.envId}
        saveAsType={saveAsType}
      />
    )
  }
}


NetDocumentsDocument.propTypes = {
  currentlySelectedDocumentEnvId: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
  filePickerAction: PropTypes.string.isRequired,
  saveAsType: PropTypes.string,

  getDocument: PropTypes.func.isRequired
}

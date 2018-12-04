import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Document from 'components/DmsFilePicker/FilePicker/ResourceList/Document/index.jsx'
import DocumentTypes from 'helpers/DocumentTypes'

export default class Imanage10Document extends React.PureComponent {

  buildMetadata() {
    const { document } = this.props
    return [
      document.author,
      moment(document.create_date).format('DD/MM/YYYY, h:mma'),
      document.last_user,
      moment(document.edit_date).format('DD/MM/YYYY, h:mma'),
      DocumentTypes.getDocumentNameString(document.extension),
      document.document_number
    ]
  }


  render() {
    const { currentlySelectedDocument, document, filePickerAction } = this.props
    const { getDocumentVersions } = this.props
    return (
      <Document
        document={document}
        filePickerAction={filePickerAction}
        metadata={this.buildMetadata()}
        getDocument={() => getDocumentVersions(document.id)}
        isSelected={_.get(currentlySelectedDocument, 'id') === document.id}
      />
    )
  }
}


Imanage10Document.propTypes = {
  currentlySelectedDocument: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
  filePickerAction: PropTypes.string.isRequired,

  getDocumentVersions: PropTypes.func.isRequired
}

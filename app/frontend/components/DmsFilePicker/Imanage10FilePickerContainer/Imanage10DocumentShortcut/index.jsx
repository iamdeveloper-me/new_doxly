import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Document from 'components/DmsFilePicker/FilePicker/ResourceList/Document/index.jsx'

// idk how to predict all of the weird extensions that may come back. We will start with pdf and docx support and move from there.
const CONTENT_SHORTCUT_TYPE_MAP = [
  { type: 'pdf', file_types: ['acrobat'] },
  { type: "docx", file_types: ['wordx'] }
]

class Imanage10DocumentShortcut extends React.PureComponent {

  buildMetadata() {
    const { documentShortcut } = this.props
    return [
      this.props.intl.formatMessage({id: 'file_picker.imanage10.shortcut_to_document'}, {document_number: documentShortcut.document_number, database: documentShortcut.database})
    ]
  }

  // we need to transform the odd extension that is coming back into the correct file_type extension, that way the proper file icons can be shown.
  mapDocumentExtension(extension) {
    return _.get(_.find(CONTENT_SHORTCUT_TYPE_MAP, { file_types: [extension.toLowerCase().replace(/\W/g, '')] }), 'type')
  }

  buildDocumentObject(extension) {
    let newDocumentShortcut = _.cloneDeep(this.props.documentShortcut)
    newDocumentShortcut.extension = extension
    return newDocumentShortcut
  }

  render() {
    const { currentlySelectedDocument, documentShortcut, filePickerAction } = this.props
    const { getDocumentVersions } = this.props
    const extension = this.mapDocumentExtension(documentShortcut.target.type)
    return (
      <Document
        document={this.buildDocumentObject(extension)}
        filePickerAction={filePickerAction}
        metadata={this.buildMetadata()}
        getDocument={() => getDocumentVersions(documentShortcut.target.id)}
        isSelected={_.get(currentlySelectedDocument, 'id') === documentShortcut.target.id}
      />
    )
  }
}

Imanage10DocumentShortcut.propTypes = {
  documentShortcut: PropTypes.object.isRequired,
  currentlySelectedDocument: PropTypes.string.isRequired,
  filePickerAction: PropTypes.string.isRequired,
  intl: intlShape.isRequired,

  getDocumentVersions: PropTypes.func.isRequired
}

export default injectIntl(Imanage10DocumentShortcut)

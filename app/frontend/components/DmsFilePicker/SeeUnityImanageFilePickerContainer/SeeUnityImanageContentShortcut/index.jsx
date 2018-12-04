import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Document from 'components/DmsFilePicker/FilePicker/ResourceList/Document/index.jsx'

// idk how to predict all of the weird extensions that may come back. We will start with pdf and docx support and move from there.
const CONTENT_SHORTCUT_TYPE_MAP = [
  { type: 'pdf', file_types: ['acrobat'] },
  { type: "docx", file_types: ['wordx'] }
]

const INVALID_DATE_STRING = "Invalid date"

export default class SeeUnityImanageContentShortcut extends React.PureComponent {

  buildMetadata(extension) {
    const { contentShortcut } = this.props
    return [
      contentShortcut.CreatedBy || "Unknown",
      this.buildDate(contentShortcut.CreatedOn),
      contentShortcut.ModifiedBy || "Unknown",
      this.buildDate(contentShortcut.ModifiedOn),
      extension,
      _.find(contentShortcut.Properties, { Field: 'TargetNumber'}).Value
    ]
  }

  buildDate(dateString) {
    const finalString = moment(dateString).format('DD/MM/YYYY, h:mma')
    if(finalString === INVALID_DATE_STRING) {
      return 'Unknown'
    } else {
      return finalString
    }
  }

  // we need to transform the odd extension that is coming back into the correct file_type extension, that way the proper file icons can be shown.
  mapDocumentExtension(extension) {
    return _.get(_.find(CONTENT_SHORTCUT_TYPE_MAP, { file_types: [extension.toLowerCase().replace(/\W/g, '')] }), 'type') || 'unknown'
  }

  buildDocumentObject(extension) {
    const { contentShortcut } = this.props
    return ({
      name: contentShortcut.Name,
      extension: extension
    })
  }

  render() {
    const { currentlySelectedDocumentEID, contentShortcut, filePickerAction, saveAsType } = this.props
    const { getDocumentVersions } = this.props
    const extension = this.mapDocumentExtension(_.find(contentShortcut.Properties, { Field: 'TargetDocumentType'}).Value)
    return (
      <Document
        document={this.buildDocumentObject(extension)}
        filePickerAction={filePickerAction}
        metadata={this.buildMetadata(extension)}
        getDocument={() => getDocumentVersions(contentShortcut.EID)}
        isSelected={currentlySelectedDocumentEID === contentShortcut.EID}
        saveAsType={saveAsType}
      />
    )
  }
}


SeeUnityImanageContentShortcut.propTypes = {
  contentShortcut: PropTypes.object.isRequired,
  currentlySelectedDocumentEID: PropTypes.string.isRequired,
  filePickerAction: PropTypes.string.isRequired,
  saveAsType: PropTypes.string,

  getDocumentVersions: PropTypes.func.isRequired
}

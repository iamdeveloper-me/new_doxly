import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import DocumentTypes from 'helpers/DocumentTypes'
import ResourceProperties from 'components/DmsFilePicker/FilePicker/ResourceProperties/index.jsx'

export default class Imanage10ResourceProperties extends React.PureComponent {

  buildVersionNumbers() {
    return this.props.versions.map((version) => (
      version.version
    ))
  }

  buildMetadataArray() {
    const currentlySelectedDocument = this.props.currentlySelectedDocument
    const currentlySelectedVersion = _.find(this.props.versions, {version: this.props.currentVersionNumber})
    return (
      [
        ['Name', currentlySelectedDocument.name],
        ['Author', currentlySelectedVersion.author],
        ['Created', moment(currentlySelectedVersion.create_date).format('DD/MM/YYYY, h:mma')],
        ['Last User', currentlySelectedVersion.last_user],
        ['Date Modified', moment(currentlySelectedVersion.edit_date).format('DD/MM/YYYY, h:mma')],
        ['Type', DocumentTypes.getDocumentNameString(currentlySelectedVersion.extension)],
        ['Version', currentlySelectedVersion.version],
        ['Document', currentlySelectedDocument.document_number]
      ]
    )
  }

  render() {
    return (
      this.props.currentlySelectedDocument ?
        <ResourceProperties
          versionNumbers={this.buildVersionNumbers()}
          currentVersionNumber={this.props.currentVersionNumber}
          setCurrentVersionNumber={this.props.setCurrentVersionNumber}
          metadataArray={this.buildMetadataArray()}
        />
      :
        <ResourceProperties
          versionNumbers={[]}
        />
    )
  }
}


Imanage10ResourceProperties.propTypes = {
  versions: PropTypes.array.isRequired,
  currentVersionNumber: PropTypes.string.isRequired,
  currentlySelectedDocument: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  resourceType: PropTypes.string.isRequired,

  setCurrentVersionNumber: PropTypes.func.isRequired
}

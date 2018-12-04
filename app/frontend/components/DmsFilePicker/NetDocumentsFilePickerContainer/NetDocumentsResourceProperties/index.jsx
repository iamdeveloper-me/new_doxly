import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import DocumentTypes from 'helpers/DocumentTypes'
import ResourceProperties from 'components/DmsFilePicker/FilePicker/ResourceProperties/index.jsx'

export default class NetDocumentsResourceProperties extends React.PureComponent {

  buildVersionNumbers() {
    return this.props.versions.map((version) => (
      version.number
    ))
  }

  buildMetadataArray() {
    const currentlySelectedResource = _.find(this.props.resources, {envId: this.props.currentlySelectedDocumentEnvId})
    const currentlySelectedVersion = _.find(this.props.versions, {number: this.props.currentVersionNumber})
    return (
      [
        ['Name', currentlySelectedResource.name],
        ['Author', currentlySelectedVersion.createdBy],
        ['Created', moment(currentlySelectedVersion.created).format('DD/MM/YYYY, h:mma')],
        ['Last User', currentlySelectedVersion.modifiedBy],
        ['Date Modified', moment(currentlySelectedVersion.modified).format('DD/MM/YYYY, h:mma')],
        ['Type', `${DocumentTypes.getDocumentNameString(currentlySelectedVersion.extension)}`],
        ['Version', currentlySelectedVersion.number],
        ['Document', currentlySelectedResource.id]
      ]
    )
  }

  render() {
    return (
      this.props.currentlySelectedDocumentEnvId ?
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


NetDocumentsResourceProperties.propTypes = {
  versions: PropTypes.array.isRequired,
  currentVersionNumber: PropTypes.string.isRequired,
  currentlySelectedDocumentEnvId: PropTypes.string.isRequired,
  resources: PropTypes.array.isRequired,

  setCurrentVersionNumber: PropTypes.func.isRequired
}

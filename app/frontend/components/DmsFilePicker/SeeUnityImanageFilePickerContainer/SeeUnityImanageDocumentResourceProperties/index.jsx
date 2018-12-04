import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import DocumentTypes from 'helpers/DocumentTypes'
import ResourceProperties from 'components/DmsFilePicker/FilePicker/ResourceProperties/index.jsx'

export default class SeeUnityImanageDocumentResourceProperties extends React.PureComponent {

  buildVersionNumbers() {
    return this.props.versions.map((version) => (
      version.VersionLabel
    ))
  }

  buildMetadataArray() {
    const { resource } = this.props
    const currentlySelectedVersion = _.find(this.props.versions, {VersionLabel: this.props.currentVersionNumber})
    const comment = resource.Properties ?
      _.find(resource.Properties, { Field: 'imProfileComment'}).Value
    :
      ''
    return (
      [
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.name' />,
          resource.Name
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.author' />,
          _.find(currentlySelectedVersion.Properties, { Field: 'Author'}).Value
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.create_date' />,
          moment(currentlySelectedVersion.created).format('DD/MM/YYYY, h:mma')
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.modified_date' />,
          moment(_.find(currentlySelectedVersion.Properties, { Field: 'Edit Date'}).Value.replace('T', ' ')).local().format('DD/MM/YYYY, h:mma')
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.class' />,
          `${DocumentTypes.getDocumentNameString(_.find(currentlySelectedVersion.Properties, { Field: 'Class'}).Value)}`
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.version' />,
          currentlySelectedVersion.VersionLabel
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.document' />,
          _.last(resource.RepID.split('document:')).split(',')[0]
        ],
        [
          <FormattedMessage id='category.tree_element.attachment.version.dms_metadata.comment' />,
          comment
        ]
      ]
    )
  }

  render() {
    return (
      this.props.currentlySelectedDocumentEID && this.props.resource ?
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


SeeUnityImanageDocumentResourceProperties.propTypes = {
  versions: PropTypes.array.isRequired,
  currentVersionNumber: PropTypes.string.isRequired,
  currentlySelectedDocumentEID: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,

  setCurrentVersionNumber: PropTypes.func.isRequired
}

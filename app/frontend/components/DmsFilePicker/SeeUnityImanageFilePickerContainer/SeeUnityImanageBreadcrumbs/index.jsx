import PropTypes from 'prop-types'
import React from 'react'

import Breadcrumbs from 'components/DmsFilePicker/FilePicker/Breadcrumbs/index.jsx'
import { RESOURCE_EXTENSIONS } from 'components/DmsFilePicker/SeeUnityImanageFilePickerContainer/index.jsx'

export default class SeeUnityImanageBreadcrumbs extends React.PureComponent {

  getFirstImagePath() {
    switch (this.props.ancestors[0].Extension) {
      case RESOURCE_EXTENSIONS.workspace_shortcut:
        return 'imanage-matter-workspace.svg'
      case RESOURCE_EXTENSIONS.workspace:
        return 'imanage-matter-workspace.svg'
      case RESOURCE_EXTENSIONS.link_folder:
        return 'imanage-folder.svg'
      case RESOURCE_EXTENSIONS.folder:
        return 'imanage-folder.svg'
      case RESOURCE_EXTENSIONS.tab:
        return 'imanage-folder.svg'
      default:
        return 'imanage-folder.svg'
    }
  }

  buildAncestors() {
    return this.props.ancestors.map(ancestor => {
      return { name: ancestor.Name }
    })
  }

  render() {
    return (
      this.props.ancestors.length > 0 ?
        <Breadcrumbs
          ancestors={this.buildAncestors()}
          firstImagePath={this.getFirstImagePath()}
          secondImagePath='imanage-folder.svg'
        />
      :
        null
    )
  }
}

SeeUnityImanageBreadcrumbs.propTypes = {
  ancestors: PropTypes.array.isRequired,
}

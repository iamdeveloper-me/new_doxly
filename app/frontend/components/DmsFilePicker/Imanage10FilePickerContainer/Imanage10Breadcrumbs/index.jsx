import PropTypes from 'prop-types'
import React from 'react'

import Breadcrumbs from 'components/DmsFilePicker/FilePicker/Breadcrumbs/index.jsx'
import { RESOURCE_EXTENSIONS } from 'components/DmsFilePicker/Imanage10FilePickerContainer/index.jsx'

export default class Imanage10Breadcrumbs extends React.PureComponent {

  getFirstImagePath() {
    switch (this.props.ancestors[0].wstype) {
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

  render() {
    return (
      this.props.ancestors.length > 0 ?
        <Breadcrumbs
          ancestors={this.props.ancestors}
          firstImagePath={this.getFirstImagePath()}
          secondImagePath='imanage-folder.svg'
        />
      :
        null
    )
  }
}

Imanage10Breadcrumbs.propTypes = {
  ancestors: PropTypes.array.isRequired,
}

import PropTypes from 'prop-types'
import React from 'react'

import Breadcrumbs from 'components/DmsFilePicker/FilePicker/Breadcrumbs/index.jsx'
import { SIDEBAR_ITEM_KEYS } from 'components/DmsFilePicker/NetDocumentsFilePickerContainer/index.jsx'

export default class NetDocumentsBreadcrumbs extends React.PureComponent {

  getFirstImagePath() {
    switch (this.props.currentSidebarRoot) {
      case SIDEBAR_ITEM_KEYS.cabinets:
        return 'net-documents-cabinet.svg'
      case SIDEBAR_ITEM_KEYS.recent_workspaces:
        return 'net-documents-workspace.svg'
      case SIDEBAR_ITEM_KEYS.favorite_workspaces:
        return 'net-documents-workspace.svg'
      default:
        return 'net-documents-folder.svg'
    }
  }

  render() {
    return (
      this.props.ancestors.length > 0 ?
        <Breadcrumbs
          ancestors={this.props.ancestors}
          firstImagePath={this.getFirstImagePath()}
          secondImagePath={'net-documents-folder.svg'}
        />
      :
        null
    )
  }
}

NetDocumentsBreadcrumbs.propTypes = {
  ancestors: PropTypes.array.isRequired,
  currentSidebarRoot: PropTypes.string.isRequired
}

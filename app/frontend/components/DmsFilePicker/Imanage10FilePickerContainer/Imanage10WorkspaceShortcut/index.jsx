import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class Imanage10WorkspaceShortcut extends React.PureComponent {

  render() {
    const { workspaceShortcut } = this.props
    const { getWorkspaceContents } = this.props
    const target = workspaceShortcut.target
    // add the name into the target because we need it for the breadcrumbs.
    target.name = workspaceShortcut.name
    return (
      <Folder
        imagePath='imanage-matter-workspace.svg'
        folder={workspaceShortcut}
        getFolderContents={() => {getWorkspaceContents(_.cloneDeep(target))}}
      />
    )
  }
}

Imanage10WorkspaceShortcut.propTypes = {
  workspaceShortcut: PropTypes.object.isRequired,

  getWorkspaceContents: PropTypes.func.isRequired
}

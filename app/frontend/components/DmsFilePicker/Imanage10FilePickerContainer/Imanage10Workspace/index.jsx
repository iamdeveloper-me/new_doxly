import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class Imanage10Workspace extends React.PureComponent {

  render() {
    const { workspace } = this.props
    const { getWorkspaceContents } = this.props
    return (
      <Folder
        imagePath='imanage-matter-workspace.svg'
        folder={workspace}
        getFolderContents={() => {getWorkspaceContents(_.cloneDeep(workspace))}}
      />
    )
  }
}

Imanage10Workspace.propTypes = {
  workspace: PropTypes.object.isRequired,

  getWorkspaceContents: PropTypes.func.isRequired
}

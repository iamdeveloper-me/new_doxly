import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class SeeUnityImanageWorkspace extends React.PureComponent {

  buildWorkspaceObject(workspace) {
    return ({
      name: workspace.Name
    })
  }

  render() {
    const { workspace } = this.props
    const { getFolderContents } = this.props
    return (
      <Folder
        imagePath='imanage-matter-workspace.svg'
        folder={this.buildWorkspaceObject(workspace)}
        getFolderContents={() => {getFolderContents(_.cloneDeep(workspace))}}
      />
    )
  }
}

SeeUnityImanageWorkspace.propTypes = {
  workspace: PropTypes.object.isRequired,

  getFolderContents: PropTypes.func.isRequired
}

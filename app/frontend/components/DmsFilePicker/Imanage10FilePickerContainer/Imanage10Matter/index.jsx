import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class Imanage10Matter extends React.PureComponent {

  render() {
    const { workspace } = this.props
    const { getWorkspaceDocuments } = this.props
    return (
      // <Folder
      //   imagePath={'net-documents-workspace.svg'}
      //   folder={workspace}
      //   getFolderContents={() => getWorkspaceDocuments(workspace.id)} // have to use the id here because netD is rejecting the envId for some reason
      // />
      <div>folder</div>
    )
  }
}

Imanage10Matter.propTypes = {
  workspace: PropTypes.object.isRequired,

  getWorkspaceDocuments: PropTypes.func.isRequired
}

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class SeeUnityImanageFolder extends React.PureComponent {

  buildFolderObject(folder) {
    return ({
      name: folder.Name
    })
  }

  render() {
    const { folder } = this.props
    const { getFolderContents } = this.props
    return (
      <Folder
        imagePath='imanage-folder.svg'
        folder={this.buildFolderObject(folder)}
        getFolderContents={() => getFolderContents(_.cloneDeep(folder))}
      />
    )
  }
}


SeeUnityImanageFolder.propTypes = {
  folder: PropTypes.object.isRequired,

  getFolderContents: PropTypes.func.isRequired
}

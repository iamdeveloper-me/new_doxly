import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class Imanage10Folder extends React.PureComponent {

  render() {
    const { folder } = this.props
    const { getFolderContents } = this.props
    return (
      <Folder
        imagePath='imanage-folder.svg'
        folder={folder}
        getFolderContents={() => getFolderContents(_.cloneDeep(folder))}
      />
    )
  }
}


Imanage10Folder.propTypes = {
  folder: PropTypes.object.isRequired,

  getFolderContents: PropTypes.func.isRequired
}

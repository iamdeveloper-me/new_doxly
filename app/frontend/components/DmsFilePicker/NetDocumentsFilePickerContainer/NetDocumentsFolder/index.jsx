import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Folder from 'components/DmsFilePicker/FilePicker/ResourceList/Folder/index.jsx'

export default class NetDocumentsFolder extends React.PureComponent {

  render() {
    const { folder } = this.props
    const { getFolderContents } = this.props
    return (
      <Folder
        imagePath='net-documents-folder.svg'
        folder={folder}
        getFolderContents={() => getFolderContents(_.cloneDeep(folder))}
      />
    )
  }
}


NetDocumentsFolder.propTypes = {
  folder: PropTypes.object.isRequired,

  getFolderContents: PropTypes.func.isRequired
}

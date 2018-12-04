import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class Folder extends React.PureComponent {

  render() {
    const { folder, iconPath, imagePath } = this.props
    const { getFolderContents } = this.props
    const icon = ( imagePath ?
      <img style={styles.folderImage} src={Assets.getPath(imagePath)} />
    :
      <i style={styles.folderIcon} className={`mdi mdi-folder-outline`}></i>
    )
    return (
      <div style={styles.folderContainer} onClick={getFolderContents}>
        <div style={styles.iconContainer}>{icon}</div>
        <div style={styles.folderName}>{folder.name}</div>
      </div>
    )
  }
}

const styles = {
  folderContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '.4rem .8rem',
    cursor: 'pointer',
    flexShrink: 0
  },
  iconContainer: {
    width: '3.5rem'
  },
  folderIcon: {
    fontSize: '3.2rem'
  },
  folderImage: {
    height: '2.8rem'
  },
  folderName: {
    marginLeft: '1.2rem'
  }
}


Folder.propTypes = {
  folder: PropTypes.object.isRequired,
  iconPath: PropTypes.string,
  imagePath: PropTypes.string,

  getFolderContents: PropTypes.func.isRequired
}

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class Cabinet extends React.PureComponent {

  render() {
    const { cabinet, getCabinetFolders, iconPath, imagePath } = this.props
    const icon = ( imagePath ?
      <img style={styles.cabinetImage} src={Assets.getPath(imagePath)} />
    :
      <i style={styles.cabinetIcon} className="mdi mdi-folder-outline"></i>
    )
    return (
      <div style={styles.cabinetContainer} onClick={() => getCabinetFolders(_.cloneDeep(cabinet))}>
        <div style={styles.iconContainer}>{icon}</div>
        <div style={styles.cabinetName}>{cabinet.name}</div>
      </div>
    )
  }
}

const styles = {
  cabinetContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '.4rem .8rem',
    cursor: 'pointer',
    flexShrink: 0
  },
  iconContainer: {
    width: '3.5rem'
  },
  cabinetIcon: {
    fontSize: '3.2rem'
  },
  cabinetImage: {
    height: '2.8rem'
  },
  cabinetName: {
    marginLeft: '1.2rem'
  }
}


Cabinet.propTypes = {
  cabinet: PropTypes.object.isRequired,
  iconPath: PropTypes.string,
  imagePath: PropTypes.string,

  getCabinetFolders: PropTypes.func.isRequired
}

import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'

export default class SidebarItem extends React.PureComponent {

  render() {
    const { sidebarItem } = this.props
    const icon = (
      sidebarItem.iconPath ?
        <i className={`mdi mdi-${sidebarItem.iconPath} mdi-24px`}></i>
      :
        <img style={styles.icon} src={Assets.getPath(sidebarItem.imagePath)} />
    )

    return (
      <div onClick={sidebarItem.onClick} style={styles.sidebarItemContainer(sidebarItem.isSelected)}>
        {icon}
        <div style={styles.name}>
          {sidebarItem.name}
        </div>
      </div>
    )
  }
}

const styles = {
  sidebarItemContainer: isSelected => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '.4rem .8rem',
    backgroundColor: isSelected ? Colors.whiteout.milk : 'inherit'
  }),
  name: {
    fontSize: '1.4rem',
    marginLeft: '1.2rem'
  },
  icon: {
    height: '2.4rem',
    width: '2.4rem'
  }
}

SidebarItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  sidebarItem: PropTypes.object.isRequired
}

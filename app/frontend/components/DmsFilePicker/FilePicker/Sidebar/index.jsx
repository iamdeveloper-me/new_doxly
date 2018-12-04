import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import SidebarItem from './SidebarItem/index.jsx'

export default class Sidebar extends React.PureComponent {

  buildSidebarItems(){
    return this.props.sidebarItems.map((sidebarItem, index) => {
      return (
        <SidebarItem key={index}
          sidebarItem={sidebarItem}
          isSelected={sidebarItem.name === this.props.currentlySelectedSidebarKey}
        />
      )
    })
  }

  render() {
    return (
      <div style={styles.sidebar}>
        {this.buildSidebarItems()}
      </div>
    )
  }
}

const styles = {
  sidebar: {
    flexGrow: '1',
    border: `.1rem solid ${Colors.whiteout.mediumGray}`
  }
}

Sidebar.propTypes = {
  currentlySelectedSidebarKey: PropTypes.string,
  sidebarItems: PropTypes.array.isRequired
}

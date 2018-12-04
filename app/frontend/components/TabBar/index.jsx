import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Tab from './Tab/index.jsx'

export default class TabBar extends React.PureComponent {

  render() {
    const { border, selectedTab, size } = this.props
    const { setSelectedTab } = this.props

    const tabs = this.props.tabs.map(tab => (
      <Tab
        key={tab.key}
        tab={tab.key}
        isActive={selectedTab === tab.key}
        setSelectedTab={() => setSelectedTab(tab.key)}
        text={tab.text}
        badge={tab.badge}
        size={size}
      />
    ))

    return (
      <div style={styles.tabBar(border)}>
        {tabs}
      </div>
    )
  }
}

const styles = {
  tabBar: border => ({
    borderBottom: border ? `.1rem solid ${Colors.gray.lighter}` : null
  })
}

TabBar.defaultProps = {
  border: false,
  size: null,
  tabs: []
}

TabBar.propTypes = {
  // attributes
  border: PropTypes.bool,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.object.isRequired
  })),

  // functions
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired
}

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import SidebarItem from './WhiteoutSidebarItem/index.jsx'

export default class WhiteoutSidebar extends React.PureComponent {

  render() {
    const { header, list, selectedItemKey, setSelectedItemKey } = this.props

    const sidebarContent = _.map(list, (item) => (
      <SidebarItem
        key={item.key}
        id={item.key}
        name={item.name}
        showBadge={item.showBadge}
        active={selectedItemKey === item.key}
        setSelectedItemKey={setSelectedItemKey}
      />
    ))

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h4>{header}</h4>
        </div>
        <div style={styles.sidebar}>
          {sidebarContent}
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflow: 'hidden',
    fontSize: '12px',
    maxWidth: '200px',
    minWidth: '200px'
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    paddingBottom: '4px',
    justifyContent: 'center'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflow: 'auto'
  }
}

WhiteoutSidebar.propTypes = {
  header: PropTypes.element.isRequired,
  list: PropTypes.array.isRequired,
  selectedItemKey: PropTypes.number.isRequired,

  setSelectedItemKey: PropTypes.func.isRequired
}

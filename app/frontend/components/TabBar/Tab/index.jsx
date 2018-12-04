import PropTypes from 'prop-types'
import React from 'react'

import Badge from 'components/Badge/index.jsx'
import Colors from 'helpers/Colors'

const sizes = ['small', null]

export default class Tab extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.setSelectedTab(this.props.tab)
  }

  render() {
    const { badge, isActive, size, text } = this.props
    const color = isActive ? Colors.button.blue : Colors.gray.normal
    const fontSize = { small: '1.2rem' }[size] || null
    
    return (
      <button
        onClick={this.onClick}
        style={isActive ? styles.active : styles.inactive}
      >
        <div style={styles.tabContent}>
          <div style={styles.tab(fontSize)}>{text}</div>
          {badge ?
            <div style={styles.badge}>
              <Badge color={color}>{badge}</Badge>
            </div>
          :
            null
          }
        </div>
      </button>
    )
  }

}

const styles = {
  tabContainer: {
    display: 'flex'
  },
  active: {
    padding: '0 12px 8px 12px',
    borderBottom: `2px solid ${Colors.button.blue}`,
    color: Colors.button.blue
  },
  inactive: {
    padding: '0 12px 8px 12px',
    borderBottom: `2px solid transparent`,
    color: Colors.gray.normal
  },
  tabContent: {
    display: 'flex'
  },
  badge: {
    paddingLeft: '4px'
  },
  tab: fontSize => ({
    fontSize: fontSize
  })
}

Tab.propTypes = {
  // attributes
  badge: PropTypes.any,
  isActive: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(sizes),
  tab: PropTypes.string.isRequired,
  text: PropTypes.element.isRequired,

  // functions
  setSelectedTab: PropTypes.func.isRequired
}

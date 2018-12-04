import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class WhiteoutSidebarItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.setSelectedItemKey(this.props.id)
  }

  render() {
    const { active, name, showBadge } = this.props

    return (
      <div
        style={styles.container(active)}
        onClick={this.onClick}
      >
        {showBadge ? <div style={styles.badge(active)}></div> : <div></div>}
        <div style={styles.name(active)}>
          {name}
        </div>
      </div>
    )
  }

}

const styles = {
  container: active => ({
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    margin: '4px',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: active ? Colors.background.blueSelect : Colors.white
  }),
  badge: active => ({
    position: 'absolute',
    left: '4px',
    padding: '2px',
    borderRadius: '50%',
    alignSelf: 'center',
    backgroundColor: active ? Colors.white : Colors.background.blueSelect,
    bottom: '40%'
  }),
  name: active => ({
    padding: '4px 4px 4px 12px',
    color: active ? Colors.white : Colors.gray.darkest
  })
}

WhiteoutSidebarItem.defaultProps = {
  showBadge: false
}

WhiteoutSidebarItem.propTypes = {
  active: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  showBadge: PropTypes.bool,

  setSelectedItemKey: PropTypes.func.isRequired
}

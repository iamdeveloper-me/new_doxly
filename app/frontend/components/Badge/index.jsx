import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class Badge extends React.PureComponent {

  render() {
    return (
      <div style={styles.badge(this.props.color)}>
        {this.props.children}
      </div>
    )
  }

}

const styles = {
  badge: color => ({
    borderRadius: '16px',
    color: Colors.white,
    padding: '0 4px',
    fontWeight: 'bold',
    fontSize: '12px',
    height: '16px',
    minWidth: '16px',
    background: color || Colors.pink.normal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })
}

Badge.propTypes = {
  color: PropTypes.string
}

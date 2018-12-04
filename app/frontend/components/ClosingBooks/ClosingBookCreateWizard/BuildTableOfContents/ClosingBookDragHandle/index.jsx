import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class ClosingBookDragHandle extends React.PureComponent {

  render() {
    const { disabled, isActive } = this.props
    let color = Colors.whiteout.blue
    if (disabled) {
      color = Colors.whiteout.gray
    } else if (!isActive) {
      color = Colors.whiteout.white
    }
    const circle = <div style={_.assign({}, styles.circle, { background: color })}></div>
    return (
      <div style={styles.dragHandle}>
        <div style={styles.firstColumn}>
          {circle}
          {circle}
          {circle}
        </div>
        <div>
          {circle}
          {circle}
          {circle}
        </div>
      </div>
    )
  }
}

const styles = {
  dragHandle: {
    marginLeft: '0.8rem',
    display: 'flex'
  },
  firstColumn: {
    marginRight: '0.2rem'
  },
  circle: {
    height: '0.3rem',
    width: '0.3rem',
    borderRadius: '50%',
    margin: '0.2rem 0'
  }
}

ClosingBookDragHandle.defaultProps = {
  disabled: false,
  isActive: true
}

ClosingBookDragHandle.propTypes = {
  disabled: PropTypes.bool,
  isActive: PropTypes.bool
}

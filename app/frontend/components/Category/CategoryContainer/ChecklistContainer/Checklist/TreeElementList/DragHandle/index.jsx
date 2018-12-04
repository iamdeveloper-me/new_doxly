import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class DragHandle extends React.PureComponent {

  render() {
    const circle = <div style={styles.circle(this.props.dragging)}></div>
    return (
      <div style={styles.dragHandle(this.props.dragging)}>
        <div style={styles.firstColumn}>
          {circle}
          {circle}
          {circle}
          {circle}
          {circle}
        </div>
        <div>
          {circle}
          {circle}
          {circle}
          {circle}
          {circle}
        </div>
      </div>
    )
  }
}

const styles = {
  dragHandle: dragging => ({
    position: 'absolute',
    background: dragging ? Colors.blue.dark : Colors.white,
    border: `1px solid ${dragging ? Colors.blue.darkest : Colors.blue.lighter}`,
    borderRadius: '4px',
    top: '4px',
    bottom: '4px',
    width: '18px',
    left: '-9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'move'
  }),
  firstColumn: {
    marginRight: '2px'
  },
  circle: dragging => ({
    height: '3px',
    width: '3px',
    background: dragging ? Colors.white : Colors.blue.lighter,
    borderRadius: '50%',
    margin: '2px 0'
  })
}

DragHandle.propTypes = {
  dragging: PropTypes.bool
}

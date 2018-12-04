import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import React from 'react'

import DragDropItemTypes from 'helpers/DragDropItemTypes'

class TreeElementDividerContainer extends React.PureComponent {

  render() {
    const { canDrop, dividers, isOver } = this.props

    return this.props.connectDropTarget(
      <div style={styles.relativeContainer}>
        <div style={styles.absoluteContainer(canDrop)}>
          {(canDrop && isOver) ? dividers : null}
        </div>
      </div>
    )
  }

}

const treeElementDividerTarget = {
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

const styles = {
  relativeContainer: {
    position: 'relative',
    marginLeft: '10px'
  },
  absoluteContainer: canDrop => ({
    position: 'absolute',
    marginTop: '-13px',
    height: '24px',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: canDrop ? 'auto' : 'none'
  })
}

TreeElementDividerContainer.propTypes = {
  canDrop: PropTypes.bool.isRequired,
  dividers: PropTypes.arrayOf(PropTypes.element).isRequired,
  isOver: PropTypes.bool.isRequired,

  connectDropTarget: PropTypes.func.isRequired
}

export default DropTarget(
  [DragDropItemTypes.UPLOAD, DragDropItemTypes.TREE_ELEMENT],
  treeElementDividerTarget,
  collect
)(TreeElementDividerContainer)

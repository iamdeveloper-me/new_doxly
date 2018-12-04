import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import Schema from 'helpers/Schema'

class TreeElementDivider extends React.PureComponent {

  render() {
    const { first, isOverCurrent, indentation } = this.props

    return this.props.connectDropTarget(
      <div>
        <div style={styles.relativeContainer(indentation, first)}>
          <div style={styles.container(indentation)}>
            <div style={styles.dropIndicator(indentation, first)}>
              <div style={styles.plus(isOverCurrent)}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const treeElementDividerTarget = {
  drop(props, monitor) {
    const itemType = monitor.getItemType()
    switch(itemType) {
      case DragDropItemTypes.UPLOAD: {
        const { treeElementBefore, treeElementAfter, parentTreeElement } = props
        const upload = monitor.getItem().upload
        let ancestry, position
        if (treeElementBefore) {
          ancestry = treeElementBefore.ancestry
          position = treeElementBefore.position+1
        } else if (treeElementAfter) {
          ancestry = treeElementAfter.ancestry
          position = treeElementAfter.position
        } else {
          ancestry = `${parentTreeElement.ancestry}/${parentTreeElement.id}`
          position = 0
        }
        const treeElement = {
          id: null,
          name: upload.file_name || "Untitled",
          type: 'Document',
          ancestry: ancestry,
          position: position
        }
        return { treeElement: treeElement }
      }
      case DragDropItemTypes.TREE_ELEMENT:
        props.moveTreeElement(monitor.getItem().treeElement, props.parentTreeElement, props.treeElementBefore)
        return
      default:
        return
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOverCurrent: monitor.isOver({ shallow: true })
  }
}

const styles = {
  alert: {
    position: 'fixed',
    width: '400px',
    top: 0,
    right: 0,
    zIndex: 1000
  },
  relativeContainer: (indentation, first) => ({
    position: 'relative',
    marginLeft: first ? 0 : 104+indentation*25,
    background: 'blue'
  }),
  container: indentation => ({
    position: 'absolute',
    height: '24px',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10+indentation
  }),
  dropIndicator: (indentation, first) => ({
    background: Colors.blue.normal,
    position: 'absolute',
    margin: `10px 0`,
    top: 0,
    left: first ? 104+indentation*25 : 0,
    right: 0,
    height: '5px',
    overflow: 'visible'
  }),
  plus: isOverCurrent => ({
    position: 'absolute',
    left: '-8px',
    top: '-5px',
    height: '15px',
    width: '15px',
    color: Colors.white,
    background: isOverCurrent ? Colors.blue.normal : Colors.white,
    border: `3px solid ${Colors.blue.normal}`,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '13px'
  })
}

TreeElementDivider.propTypes = {
  first: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  parentTreeElement: Schema.treeElement, // eslint-disable-line
  treeElementAfter: Schema.treeElement, // eslint-disable-line
  treeElementBefore: Schema.treeElement, // eslint-disable-line

  addTreeElement: PropTypes.func.isRequired, // eslint-disable-line
  moveTreeElement: PropTypes.func.isRequired, // eslint-disable-line

  // DnD
  connectDropTarget: PropTypes.func.isRequired,
  isOverCurrent: PropTypes.bool.isRequired,
}

export default DropTarget(
  [DragDropItemTypes.UPLOAD, DragDropItemTypes.TREE_ELEMENT],
  treeElementDividerTarget,
  collect
)(TreeElementDivider)

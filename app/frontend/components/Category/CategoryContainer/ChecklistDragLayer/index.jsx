import { DragLayer } from 'react-dnd'
import PropTypes from 'prop-types'
import React from 'react'

import DragDropItemTypes from 'helpers/DragDropItemTypes'
import TreeElement from './TreeElement/index.jsx'
import Upload from './Upload/index.jsx'

class ChecklistDragLayer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  getItemStyles(props) {
    const { initialOffset, currentOffset } = props
    if (!initialOffset || !currentOffset) {
      return {
        display: 'none',
      }
    }

    let { x, y } = currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
      transform,
      WebkitTransform: transform,
    }
  }

  renderItem(type, item) {
    const { noteError, notesLoading, publicNotes, teamNotes } = this.props
    const { addNote, deleteNote, getNotes } = this.props

    switch(type) {
      case DragDropItemTypes.TREE_ELEMENT:
        return <TreeElement treeElement={item.treeElement} />
      case DragDropItemTypes.UPLOAD:
        return <Upload
                 upload={item.upload}
                 publicNotes={publicNotes}
                 teamNotes={teamNotes}
                 notesLoading={notesLoading}
                 noteError={noteError}
                 addNote={addNote}
                 deleteNote={deleteNote}
                 getNotes={getNotes}
               />
      default:
        return null
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props

    if (!isDragging) {
      return null
    }

    return (
      <div style={styles.dragLayer}>
        <div style={this.getItemStyles(this.props, itemType)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }

}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

const styles = {
  dragLayer: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }
}

ChecklistDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,

  // DnD
  isDragging: PropTypes.bool.isRequired
}

export default DragLayer(collect)(ChecklistDragLayer)

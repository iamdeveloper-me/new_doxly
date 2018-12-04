import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import ClosingTreeElementHeaderClosing from './ClosingTreeElementHeaderClosing/index.jsx'
import ClosingTreeElementHeaderCollaboration from './ClosingTreeElementHeaderCollaboration/index.jsx'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import DragHandle from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/DragHandle/index.jsx'
import { ProductContext, can } from 'components/ProductContext/index.jsx'

class ClosingTreeElementHeader extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    })
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  handleClick() {
    const { selectTreeElement } = this.props
    const { treeElement } = this.props
    if (!treeElement.is_restricted && selectTreeElement) {
      selectTreeElement(this.props.treeElement)
    }
  }

  render() {
    const { connectDropTarget, currentDealEntityUserIsOwner, details, docStatus, indentation, isDragging, isOver, isReserved, isSelected, lastChangeDate, responsibility, treeElement, type } = this.props
    const { nameComponent, toggleComponent } = this.props

    const dropFunc = isReserved ? content => { return content } : connectDropTarget
    return dropFunc(
      <div>
        <ProductContext.Consumer>
          {features => (
            <div style={styles.itemContainer} className="no-page-break">
              <div style={styles.grayBox}></div>
              <div style={styles.draggable(isDragging)}>
                <div
                  style={styles.row(isReserved, (isSelected || isOver))}
                  onMouseEnter={this.onMouseEnterHandler}
                  onMouseLeave={this.onMouseLeaveHandler}
                  onClick={this.handleClick}
                >
                  {this.props.connectDragSource((this.state.hover && !isReserved) ? <div><DragHandle /></div> : null)}
                  {can(/R/, features.responsible_parties) ?
                    <ClosingTreeElementHeaderCollaboration {...this.props} />
                  :
                    <ClosingTreeElementHeaderClosing {...this.props} hover={this.state.hover} />
                  }
                </div>
              </div>
            </div>
          )}
        </ProductContext.Consumer>
      </div>
    )
  }
}

const treeElementHeaderTarget = {
  drop(props) {
    return { treeElement: props.treeElement }
  }
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const treeElementSource = {
  beginDrag(props) {
    return {
      treeElement: props.treeElement
    }
  }
}

const styles = {
  itemContainer: {
    display: 'grid',
    gridTemplateColumns: '10px 1fr'
  },
  grayBox: {
    height: '100%',
    background: Colors.gray.lightest
  },
  draggable: isDragging => ({
    opacity: isDragging ? .25 : 1,
    border: isDragging ? `2px dashed ${Colors.gray.light}` : ''
  }),
  row: (reserved, selected) => ({
    padding: `4px 0 ${selected ? '3px' : '4px'} 0`,
    width: '100%',
    backgroundColor: getBackgroundColor(reserved, selected),
    border: selected
      ? `2px solid ${Colors.blue.normal}`
      : '2px solid transparent',
    borderBottom: selected
      ? `2px solid ${Colors.blue.normal}`
      : `1px solid ${Colors.gray.lightest}`,
    cursor: reserved ? 'default' : 'pointer',
    minHeight: '48px',
    position: 'relative'
  })
}

const getBackgroundColor = (reserved, selected) => {
  if (reserved) {
    return Colors.background.gray
  } else if (selected) {
    return Colors.blue.lightest
  } else {
    return Colors.white
  }
}

ClosingTreeElementHeader.defaultProps = {
  indentation: 0
}

ClosingTreeElementHeader.propTypes = {
  actions: PropTypes.element,
  checkmark: PropTypes.element,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  details: PropTypes.element,
  docStatus: PropTypes.element,
  indentation: PropTypes.number,
  isReserved: PropTypes.bool,
  isSelected: PropTypes.bool,
  lastChangeDate: PropTypes.string,
  nameComponent: PropTypes.element,
  responsibility: PropTypes.element,
  toggleComponent: PropTypes.element,
  treeElement: PropTypes.object.isRequired,
  type: PropTypes.element,
  signatureType: PropTypes.element,

  selectTreeElement: PropTypes.func.isRequired,

  // DnD
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired
}

export default DropTarget(
  DragDropItemTypes.UPLOAD,
  treeElementHeaderTarget,
  collectTarget
)(
  DragSource(
    DragDropItemTypes.TREE_ELEMENT,
    treeElementSource,
    collectSource
  )(ClosingTreeElementHeader)
)

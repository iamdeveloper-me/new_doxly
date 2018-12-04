import { injectIntl, intlShape } from 'react-intl'
import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import DragHandle from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/DragHandle/index.jsx'
import Schema from 'helpers/Schema'

class DataRoomTreeElementHeader extends React.PureComponent {

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
    const { iconPath, indentation, isDragging, isOver, isReserved, isSelected, nameComponent, status, toggleComponent, treeElement, viewStatus } = this.props
    return this.props.connectDropTarget(
      <div style={styles.itemContainer} className="no-page-break">
        <div style={styles.grayBox}></div>
        <div style={styles.draggable(isDragging)}>
          <div
            style={styles.row(isReserved, (isSelected || isOver))}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
            onClick={this.handleClick}
          >
            {this.props.connectDragSource(this.state.hover && !isReserved ? <div><DragHandle /></div> : null)}
            <div style={styles.grid} className="flex-grid">
              <div style={styles.leftBox} className="flex-grid-left-box">
                <div style={styles.indentation(indentation)}></div>
                <div style={styles.toggle}>{toggleComponent}</div>
                <div style={styles.icon}>
                  <img src={iconPath} />
                </div>
                {nameComponent}
                {treeElement.tree_element_restrictions.length > 0 ?
                  <div style={styles.lockIcon}>
                    <img src={Assets.getPath('ic-lock-24-px.svg')} />
                  </div>
                :
                  null
                }
              </div>
              {!isReserved ?
                <div style={styles.doc} className="flex-grid-doc">
                  {viewStatus}
                </div>
              :
                null
              }
              {!isReserved ?
                <div style={styles.doc} className="flex-grid-review-status">
                  {status}
                </div>
              :
                null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const treeElementHeaderTarget = {
  drop(props, monitor) {
    if (props.treeElement.type === 'Folder') {
      let upload = monitor.getItem().upload
      const treeElement = {
        id: null,
        name: upload.file_name || this.props.intl.formatMessage({id: 'category.treeElement.untitled'}),
        type: 'Document',
        ancestry: props.treeElement.ancestry + '/' + props.treeElement.id,
        position: '1'
      }
      return { treeElement: treeElement }
    } else  {
      return { treeElement: props.treeElement }
    }
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
    backgroundColor: getBackgroundColor(reserved, selected),
    padding: `4px 8px ${selected ? '3px' : '4px'} 0`,
    border: selected
      ? `2px solid ${Colors.blue.normal}`
      : `2px solid transparent`,
    borderBottom: selected
      ? `2px solid ${Colors.blue.normal}`
      : `1px solid ${Colors.gray.lightest}`,
    cursor: reserved ? 'default' : 'pointer',
    minHeight: '48px',
    position: 'relative'
  }),
  grid: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '48% 14% 40%'
  },
  toggle: {
    width: '32px',
    flexShrink: 0,
    display: 'flex',
    paddingTop: '7px',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  indentation: (indentation) => ({
    width: indentation * 25,
    flexShrink: 0
  }),
  doc: {
    width: '136px',
    flexShrink: 0,
    paddingTop: '4px'
  },
  icon: {
    width: '36px',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '4px'
  },
  leftBox: {
    display: 'flex'
  },
  lockIcon: {
    height: '24px',
    margin: '5px'
  }
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

DataRoomTreeElementHeader.defaultProps = {
  iconPath: '',
  indentation: 0,
  status: null,
  toggleComponent: null,
  viewStatus: null
}

DataRoomTreeElementHeader.propTypes = {
  // attributes
  iconPath: PropTypes.string,
  indentation: PropTypes.number,
  intl: intlShape.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool,
  isReserved: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  nameComponent: PropTypes.element.isRequired,
  status: PropTypes.element,
  toggleComponent: PropTypes.element,
  treeElement: Schema.treeElement,
  viewStatus: PropTypes.element,

  // functions
  connectDropTarget: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func

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
  )(injectIntl(DataRoomTreeElementHeader))
)

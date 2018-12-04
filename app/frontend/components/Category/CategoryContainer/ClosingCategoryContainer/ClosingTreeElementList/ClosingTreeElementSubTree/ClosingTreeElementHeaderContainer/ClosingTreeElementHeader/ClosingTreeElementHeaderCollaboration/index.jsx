import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'

export default class ClosingTreeElementHeaderCollaboration extends React.PureComponent {

  render() {
    const { checkmark, connectDropTarget, currentDealEntityUserIsOwner, details, docStatus, indentation, isDragging, isOver, isReserved, isSelected, lastChangeDate, responsibility, treeElement } = this.props
    const { nameComponent, toggleComponent } = this.props

    return (
      <div style={styles.grid} className="flex-grid">
        <div style={styles.leftBox} className="flex-grid-left-box">
          <div style={styles.checkmarkContainer}>{checkmark}</div>
          <div style={styles.indentation(indentation)}></div>
          <div style={styles.toggle}>{toggleComponent}</div>
          {nameComponent}
          {(currentDealEntityUserIsOwner && treeElement.tree_element_restrictions.length > 0) ?
            <div style={styles.lockIcon}>
              <img src={Assets.getPath('ic-lock-24-px.svg')} />
            </div>
          :
            null
          }
        </div>
        {!isReserved ?
          <div style={styles.doc} className="flex-grid-doc">
            {docStatus}
          </div>
        :
          null
        }
        <div style={styles.status} className="flex-grid-status">
          {responsibility}
        </div>
        <div style={styles.lastChange} className="flex-grid-last-change">
          {lastChangeDate}
        </div>
        <div style={styles.details} className="flex-grid-details">
          {details}
        </div>
      </div>
    )
  }
}

const styles = {
  grid: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '3fr 128px 128px 96px 1fr'
  },
  toggle: {
    width: '40px',
    flexShrink: 0,
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '7px'
  },
  indentation: indentation => ({
    width: indentation * 25,
    flexShrink: 0
  }),
  doc: {
    alignSelf: 'center',
    padding: '0 4px'
  },
  status: {
    alignSelf: 'center',
    padding: '0 4px'
  },
  lastChange: {
    alignSelf: 'center',
    padding: '0 4px',
    fontSize: '12px',
    color: Colors.blueGray.normal,
  },
  details: {
    alignSelf: 'center',
    padding: '0 4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '12px',
    color: Colors.blueGray.normal
  },
  leftBox: {
    display: 'flex',
    wordBreak: 'break-word',
    marginLeft: '24px'
  },
  lockIcon: {
    height: '24px',
    margin: '5px'
  },
  checkmarkContainer: {
    width: '32px'
  }
}

ClosingTreeElementHeaderCollaboration.defaultProps = {
  indentation: 0
}

ClosingTreeElementHeaderCollaboration.propTypes = {
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

  selectTreeElement: PropTypes.func.isRequired
}
import PropTypes from 'prop-types'
import React from 'react'

import DataRoomChecklistNumber from './DataRoomTreeElementHeader/DataRoomChecklistNumber/index.jsx'
import DataRoomTreeElementHeader from './DataRoomTreeElementHeader/index.jsx'
import Schema from 'helpers/Schema'
import TreeElementDividers from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementDividers/index.jsx'
import TreeElementName from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementName/index.jsx'

export default class DataRoomTreeElementHeaderContainer extends React.PureComponent {

  render() {
    const { expanded, indentation, lastChildren, nameTextStyles, originalTree, parentTreeElement, selectedTreeElement, toggleComponent, treeElement } = this.props
    const { addTreeElement, moveTreeElement, selectTreeElement } = this.props
    const isSelected = this.props.selectedTreeElement && this.props.treeElement.id === this.props.selectedTreeElement.id && !this.props.showUploads
    // to pass in editableTreeElement
    const nameComponent = this.props.nameComponent ?
        this.props.nameComponent
      :
        <TreeElementName
          nameTextStyles={nameTextStyles}
          treeElement={treeElement}
          isReserved={treeElement.is_restricted}
          checklistNumberComponent={
            <DataRoomChecklistNumber
              parentNumber={this.props.parentNumber}
              position={treeElement.position}
              numberingStyle={nameTextStyles}
            />
          }
        />
    return (
      <div>
        <DataRoomTreeElementHeader
          nameComponent={nameComponent}
          viewStatus={this.props.viewStatus}
          status={this.props.status}
          docStatus={this.props.docStatus}
          treeElement={treeElement}
          indentation={indentation}
          selectedTreeElement={selectedTreeElement}
          selectTreeElement={selectTreeElement}
          toggleComponent={toggleComponent}
          iconPath={this.props.iconPath}
          isSelected={isSelected}
          isReserved={treeElement.is_restricted}
        />
        <TreeElementDividers
          expanded={expanded}
          lastChildren={lastChildren}
          addTreeElement={addTreeElement}
          moveTreeElement={moveTreeElement}
          indentation={indentation}
          parentTreeElement={parentTreeElement}
          originalTree={originalTree}
          treeElement={treeElement}
          categoryType={'DiligenceCategory'}
        />
      </div>
    )
  }

}

DataRoomTreeElementHeaderContainer.defaultProps = {
  iconPath: '',
  indentation: 0,
  nameComponent: null,
  nameTextStyles: null,
  parentNumber: '',
  viewStatus: null
}

DataRoomTreeElementHeaderContainer.propTypes = {
  // attributes
  docStatus: PropTypes.element,
  expanded: PropTypes.bool.isRequired,
  iconPath: PropTypes.string,
  indentation: PropTypes.number,
  lastChildren: PropTypes.array.isRequired,
  originalTree: PropTypes.array.isRequired,
  nameComponent: PropTypes.element,
  nameTextStyles: PropTypes.object,
  parentNumber: PropTypes.string,
  parentTreeElement: Schema.treeElement,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  status: PropTypes.element,
  toggleComponent: PropTypes.element,
  treeElement: Schema.treeElement.isRequired,
  viewStatus: PropTypes.element,

  // functions
  addTreeElement: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired

}

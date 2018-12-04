import PropTypes from 'prop-types'
import React from 'react'

import ClosingChecklistNumber from './ClosingTreeElementHeader/ClosingChecklistNumber/index.jsx'
import ClosingTreeElementHeader from './ClosingTreeElementHeader/index.jsx'
import Schema from 'helpers/Schema'
import TreeElementDividers from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementDividers/index.jsx'
import TreeElementName from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/TreeElementName/index.jsx'

export default class ClosingTreeElementHeaderContainer extends React.PureComponent {

  render() {
    const { actions, checkmark, currentDealEntityUserIsOwner, details, docStatus, expanded, indentation, lastChangeDate, lastChildren, nameComponent, nameTextStyles, originalTree, parentTreeElement, responsibility, selectedTreeElement, showUploads, signatureType, toggleComponent, treeElement, type } = this.props
    const { addTreeElement, moveTreeElement, selectTreeElement, updateTreeElement } = this.props
    const isSelected = selectedTreeElement && treeElement.id === selectedTreeElement.id && !showUploads
    // to pass in editableTreeElement
    const treeElementNameComponent = nameComponent ?
        this.props.nameComponent
      :
        <TreeElementName
          nameTextStyles={nameTextStyles}
          treeElement={treeElement}
          isReserved={treeElement.is_restricted}
          updateTreeElement={updateTreeElement}
          checklistNumberComponent={
            <ClosingChecklistNumber
              indentation={indentation}
              position={treeElement.position}
              numberingStyle={nameTextStyles}
            />
          }
        />

    return (
      <div>
        <ClosingTreeElementHeader
          actions={actions}
          checkmark={checkmark}
          type={type}
          signatureType={signatureType}
          nameComponent={treeElementNameComponent}
          isSelected={isSelected}
          docStatus={docStatus}
          responsibility={responsibility}
          details={details}
          treeElement={treeElement}
          indentation={indentation}
          lastChangeDate={lastChangeDate}
          selectedTreeElement={selectedTreeElement}
          selectTreeElement={selectTreeElement}
          toggleComponent={toggleComponent}
          isReserved={treeElement.is_restricted}
          currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
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
          categoryType={'ClosingCategory'}
        />
      </div>
    )
  }

}

ClosingTreeElementHeaderContainer.defaultProps = {
  indentation: 0,
  nameTextStyles: null
}

ClosingTreeElementHeaderContainer.propTypes = {
  actions: PropTypes.element,
  checkmark: PropTypes.element,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  details: PropTypes.element,
  docStatus: PropTypes.element,
  expanded: PropTypes.bool.isRequired,
  indentation: PropTypes.number,
  lastChangeDate: PropTypes.string,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  nameComponent: PropTypes.element,
  nameTextStyles: PropTypes.object,
  parentTreeElement: Schema.treeElement,
  responsibility: PropTypes.element,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  toggleComponent: PropTypes.element,
  treeElement: Schema.treeElement.isRequired,
  type: PropTypes.element,
  signatureType: PropTypes.element,

  addTreeElement: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired
}

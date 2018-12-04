import _ from 'lodash'
import {
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ChecklistItemContainer from './ChecklistItemContainer/index.jsx'
import ClosingChecklistNumber from './ClosingTreeElementHeaderContainer/ClosingTreeElementHeader/ClosingChecklistNumber/index.jsx'
import ClosingSectionContainer from './ClosingSectionContainer/index.jsx'
import ClosingTreeElementHeaderContainer from './ClosingTreeElementHeaderContainer/index.jsx'
import EditableTreeElement from 'components/Category/CategoryContainer/ChecklistContainer/Checklist/TreeElementList/EditableTreeElement/index.jsx'
import Schema from 'helpers/Schema'

class ClosingTreeElementSubTree extends React.Component {

  // Note: using `!=` instead of `!==` intentionally in this method
  // because `undefined && true` is `undefined` and `null && true` is `null`
  // but React needs `true` or `false` returned
  // `undefined !== null && true` would be true, but `null !== null && true` would be `false`
  // however `undefined != null && true` and `null != null && true` are both `false`
  shouldComponentUpdate(nextProps) {
    if (nextProps != this.props) {
      if (JSON.stringify(nextProps.tree) != JSON.stringify(this.props.tree)) {
        return true
      } else if (this.props.parentTreeElement && nextProps.selectedTreeElement && !this.props.selectedTreeElement) {
        // first time a tree element was selected
        return nextProps.selectedTreeElement.ancestry != null && nextProps.selectedTreeElement.ancestry.indexOf(this.props.parentTreeElement.id) !== -1
      } else if (this.props.parentTreeElement && (nextProps.selectedTreeElement !== this.props.selectedTreeElement)) {
        // tree element already selected
        return (nextProps.selectedTreeElement != null && nextProps.selectedTreeElement.ancestry != null && nextProps.selectedTreeElement.ancestry.indexOf(this.props.parentTreeElement.id) !== -1) || (nextProps.selectedTreeElement != null && this.props.selectedTreeElement.ancestry != null && this.props.selectedTreeElement.ancestry.indexOf(this.props.parentTreeElement.id) !== -1)
      } else {
        return true
      }
    }
    return false
  }

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, hasVotingThreshold, indentation, intl, nameTextStyles, noteError, notesLoading, ongoingUploads, originalTree, parentTreeElement, publicNotes, selectedTreeElement, showUploads, teamNotes, tree } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, deleteTreeElement, getNotes, moveTreeElement, removeEditableTreeElement, selectTreeElement, sendVersionToDms, setActiveParty, updateEditableTreeElement, updateTreeElement, updateVersion, uploadVersion } = this.props

    const treeElements = tree.map((treeElement, index, array) => {

      let view = null
      const lastChildren = _.concat(this.props.lastChildren, index === array.length-1)
      if (!treeElement.id) {
        view =  <EditableTreeElement
                  addTreeElement={addTreeElement}
                  moveTreeElement={moveTreeElement}
                  selectTreeElement={selectTreeElement}
                  updateEditableTreeElement={updateEditableTreeElement}
                  removeEditableTreeElement={removeEditableTreeElement}
                  indentation={indentation}
                  selectedTreeElement={selectedTreeElement}
                  showUploads={showUploads}
                  treeElement={treeElement}
                  treeElementHeaderContainer={ClosingTreeElementHeaderContainer}
                  originalTree={this.props.originalTree}
                  label={intl.formatMessage({id: 'category.checklist.checklist_item_name'})}
                  lastChildren={lastChildren}
                  currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                  deletePlacedUploadVersion={deletePlacedUploadVersion}
                  checklistNumberComponent={
                    <ClosingChecklistNumber
                      indentation={indentation}
                      position={treeElement.position}
                      numberingStyle={nameTextStyles}
                    />
                  }
                />
      } else if (treeElement.type === 'Section') {
        view =  <ClosingSectionContainer
                  addTreeElement={addTreeElement}
                  updateEditableTreeElement={updateEditableTreeElement}
                  removeEditableTreeElement={removeEditableTreeElement}
                  selectedTreeElement={selectedTreeElement}
                  selectTreeElement={selectTreeElement}
                  treeElement={treeElement}
                  showUploads={showUploads}
                  moveTreeElement={moveTreeElement}
                  setActiveParty={setActiveParty}
                  parentTreeElement={parentTreeElement}
                  originalTree={originalTree}
                  lastChildren={lastChildren}
                  publicNotes={publicNotes}
                  teamNotes={teamNotes}
                  notesLoading={notesLoading}
                  noteError={noteError}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  getNotes={getNotes}
                  currentDealEntityUser={currentDealEntityUser}
                  currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                  deletePlacedUploadVersion={deletePlacedUploadVersion}
                  dmsType={dmsType}
                  createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
                  updateTreeElement={updateTreeElement}
                  updateVersion={updateVersion}
                  deleteTreeElement={deleteTreeElement}
                  uploadVersion={uploadVersion}
                  sendVersionToDms={sendVersionToDms}
                  ongoingUploads={ongoingUploads}
                  hasVotingThreshold={hasVotingThreshold}
                />
      } else {
        view =  <ChecklistItemContainer
                  addTreeElement={addTreeElement}
                  updateEditableTreeElement={updateEditableTreeElement}
                  removeEditableTreeElement={removeEditableTreeElement}
                  indentation={indentation}
                  selectedTreeElement={selectedTreeElement}
                  selectTreeElement={selectTreeElement}
                  treeElement={treeElement}
                  showUploads={showUploads}
                  moveTreeElement={moveTreeElement}
                  setActiveParty={setActiveParty}
                  parentTreeElement={parentTreeElement}
                  originalTree={originalTree}
                  lastChildren={lastChildren}
                  publicNotes={publicNotes}
                  teamNotes={teamNotes}
                  notesLoading={notesLoading}
                  noteError={noteError}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  getNotes={getNotes}
                  currentDealEntityUser={currentDealEntityUser}
                  currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                  deletePlacedUploadVersion={deletePlacedUploadVersion}
                  dmsType={dmsType}
                  createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
                  updateTreeElement={updateTreeElement}
                  updateVersion={updateVersion}
                  deleteTreeElement={deleteTreeElement}
                  uploadVersion={uploadVersion}
                  sendVersionToDms={sendVersionToDms}
                  ongoingUploads={ongoingUploads}
                  hasVotingThreshold={hasVotingThreshold}
                />
      }

      return (
        <div key={`tree_element_${treeElement.id}`}>
          {view}
        </div>
      )
    })
    return (
      <div style={styles.container(parentTreeElement)}>
        {treeElements}
      </div>
    )
  }

}

const styles = {
  container: parentTreeElement => ({
    overflow: parentTreeElement ? 'visible' : 'hidden',
    flex: '1',
    position: 'relative'
  })
}

ClosingTreeElementSubTree.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  hasVotingThreshold: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  nameTextStyles: PropTypes.object,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentTreeElement: Schema.treeElement,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  tree: PropTypes.arrayOf(Schema.treeElement).isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteTreeElement: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  setActiveParty: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

export default injectIntl(ClosingTreeElementSubTree)

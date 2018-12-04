import PropTypes from 'prop-types'
import React from 'react'

import ClosingSectionActions from './ClosingSectionActions/index.jsx'
import ClosingTreeElementHeaderContainer from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ClosingTreeElementHeaderContainer/index.jsx'
import ClosingTreeElementSubTree from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/index.jsx'
import Colors from 'helpers/Colors'
import Schema from 'helpers/Schema'
import Toggle from 'components/Toggle/index.jsx'

export default class ClosingSection extends React.PureComponent {

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, expanded, hasVotingThreshold, lastChildren, noteError, notesLoading, ongoingUploads, originalTree, publicNotes, selectedTreeElement, showUploads, teamNotes, toggle, treeElement } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, deleteTreeElement, getNotes, moveTreeElement, removeEditableTreeElement, selectTreeElement, sendVersionToDms, setActiveParty, updateTreeElement, updateEditableTreeElement, updateVersion, uploadVersion } = this.props
    const nameTextStyles={
      fontWeight: '500',
      fontSize: '15px',
      color: Colors.gray.darkest
    }

    return (
      <div style={styles.closingSection}>
        <ClosingTreeElementHeaderContainer
          expanded={expanded}
          addTreeElement={addTreeElement}
          nameTextStyles={nameTextStyles}
          toggleComponent={<Toggle toggle={toggle} expanded={expanded} />}
          treeElement={treeElement}
          selectedTreeElement={selectedTreeElement}
          selectTreeElement={selectTreeElement}
          showUploads={showUploads}
          moveTreeElement={moveTreeElement}
          originalTree={originalTree}
          lastChildren={lastChildren}
          currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
          deletePlacedUploadVersion={deletePlacedUploadVersion}
          updateTreeElement={updateTreeElement}
          actions={
            <ClosingSectionActions
              treeElement={treeElement}
              deleteTreeElement={deleteTreeElement}
              ongoingUploads={ongoingUploads}
            />
          }
        />
        <div>
          {expanded ?
            <ClosingTreeElementSubTree
              addTreeElement={addTreeElement}
              updateEditableTreeElement={updateEditableTreeElement}
              removeEditableTreeElement={removeEditableTreeElement}
              originalTree={originalTree}
              tree={treeElement.children || []}
              indentation={1}
              selectedTreeElement={selectedTreeElement}
              selectTreeElement={selectTreeElement}
              showUploads={showUploads}
              moveTreeElement={moveTreeElement}
              parentTreeElement={treeElement}
              setActiveParty={setActiveParty}
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
          :
            ''
          }
        </div>
      </div>
    )
  }

}

const styles = {
  closingSection: {
    marginBottom: '10px',
    position: 'relative'
  }
}

ClosingSection.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  hasVotingThreshold: PropTypes.bool.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  teamNotes: PropTypes.array.isRequired,
  treeElement: Schema.treeElement.isRequired,
  showUploads: PropTypes.bool.isRequired,

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
  toggle: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

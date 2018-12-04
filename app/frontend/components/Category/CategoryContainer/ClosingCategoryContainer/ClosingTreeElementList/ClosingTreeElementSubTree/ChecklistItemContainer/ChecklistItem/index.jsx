import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import ClosingChecklistItemActions from './ClosingChecklistItemActions/index.jsx'
import ClosingChecklistItemCheckmark from './ClosingChecklistItemCheckmark/index.jsx'
import ClosingChecklistItemDetails from './ClosingChecklistItemDetails/index.jsx'
import ClosingChecklistItemType from './ClosingChecklistItemType/index.jsx'
import ClosingDocumentBadge from './ClosingDocumentBadge/index.jsx'
import ClosingTreeElementHeaderContainer from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ClosingTreeElementHeaderContainer/index.jsx'
import ClosingTreeElementSubTree from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/index.jsx'
import Colors from 'helpers/Colors'
import ResponsiblePartyDropdown from 'components/ResponsiblePartyDropdown/index.jsx'
import Schema from 'helpers/Schema'
import SignatureTypeDropdown from 'components/Category/CategoryContainer/SignatureTypeDropdown/index.jsx'

export default class ChecklistItem extends React.PureComponent {

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, hasVotingThreshold, indentation, lastChildren, noteError, notesLoading, ongoingUploads, originalTree, parentTreeElement, publicNotes, selectedTreeElement, showUploads, teamNotes, treeElement } = this.props
    const { addNote, addTreeElement, changeTreeElementType, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, deleteTreeElement, getNotes, markAsFinalOrComplete, moveTreeElement, removeEditableTreeElement, selectTreeElement, sendVersionToDms, setActiveParty, updateEditableTreeElement, updateTreeElement, updateVersion, uploadVersion } = this.props
    const activeParty = _.find(treeElement.responsible_parties, ['is_active', true])
    const isComplete = !!_.get(treeElement, 'completion_statuses[0].is_complete')
    const isFinal = ["final", "executed"].includes(_.get(treeElement, 'attachment.latest_version.status'))
    const signatureTypeDropdown = (
      treeElement.type === 'Document' ?
        <SignatureTypeDropdown
          treeElement={treeElement}
          updateTreeElement={updateTreeElement}
          showTextOnTrigger={false}
          hasVotingThreshold={hasVotingThreshold}
        />
      :
        null
    )
    const completeBadge = <div style={styles.container}>
                            <img src={Assets.getPath('reviewed.svg')}/>
                            <div style={styles.status}>
                              <FormattedMessage id='category.tree_element.completion_status.complete' />
                            </div>
                          </div>
    const responsibleParty = activeParty ?
                              <ResponsiblePartyDropdown
                                treeElement={treeElement}
                                setActiveParty={setActiveParty}
                              />
                            :
                              null
    return (
      <div>
        <ClosingTreeElementHeaderContainer
          expanded={true}
          checkmark={
            <ClosingChecklistItemCheckmark
              checked={isFinal || isComplete}
              markAsFinalOrComplete={markAsFinalOrComplete}
            />
          }
          type={
            <ClosingChecklistItemType
              type={treeElement.type}
              changeTreeElementType={changeTreeElementType}
            />
          }
          signatureType={signatureTypeDropdown}
          docStatus={
            <ClosingDocumentBadge
              treeElement={treeElement}
              version={treeElement.attachment ? treeElement.attachment.latest_version : null}
              publicNotes={publicNotes}
              teamNotes={teamNotes}
              notesLoading={notesLoading}
              noteError={noteError}
              addNote={addNote}
              deleteNote={deleteNote}
              getNotes={getNotes}
              dmsType={dmsType}
              currentDealEntityUser={currentDealEntityUser}
              deletePlacedUploadVersion={deletePlacedUploadVersion}
            />
          }
          actions={
            <ClosingChecklistItemActions
              dmsType={dmsType}
              version={treeElement.attachment ? treeElement.attachment.latest_version : null}
              currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
              treeElement={treeElement}
              ongoingUploads={ongoingUploads}
              deleteTreeElement={deleteTreeElement}
              uploadVersion={uploadVersion}
              sendVersionToDms={sendVersionToDms}
            />
          }
          responsibility={(isComplete || isFinal) ? completeBadge : responsibleParty}
          lastChangeDate={activeParty ? moment(activeParty.updated_at).fromNow() : null}
          details={
            treeElement.is_restricted ?
              null
            :
              <ClosingChecklistItemDetails
                treeElement={treeElement}
                updateTreeElement={updateTreeElement}
              />
          }
          indentation={indentation}
          treeElement={treeElement}
          selectedTreeElement={selectedTreeElement}
          selectTreeElement={selectTreeElement}
          showUploads={showUploads}
          addTreeElement={addTreeElement}
          moveTreeElement={moveTreeElement}
          originalTree={originalTree}
          parentTreeElement={parentTreeElement}
          lastChildren={lastChildren}
          currentDealEntityUser={currentDealEntityUser}
          currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
          deletePlacedUploadVersion={deletePlacedUploadVersion}
          updateTreeElement={updateTreeElement}
        />
        <div>
          <ClosingTreeElementSubTree
            addTreeElement={addTreeElement}
            updateEditableTreeElement={updateEditableTreeElement}
            removeEditableTreeElement={removeEditableTreeElement}
            originalTree={originalTree}
            tree={treeElement.children || []}
            indentation={indentation+1}
            selectedTreeElement={selectedTreeElement}
            selectTreeElement={selectTreeElement}
            showUploads={showUploads}
            moveTreeElement={moveTreeElement}
            parentTreeElement={treeElement}
            lastChildren={lastChildren}
            setActiveParty={setActiveParty}
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
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    color: Colors.reviewStatus.reviewed,
    paddingLeft: '4px',
    fontSize: '12px'
  }
}

ChecklistItem.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  hasVotingThreshold: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentTreeElement: Schema.treeElement.isRequired,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  addTreeElement: PropTypes.func.isRequired,
  changeTreeElementType: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteTreeElement: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  markAsFinalOrComplete: PropTypes.func.isRequired,
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

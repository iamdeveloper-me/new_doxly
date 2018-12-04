import {
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ChecklistItem from './ChecklistItem/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import Schema from 'helpers/Schema'
import { SIGNATURE_TYPES } from 'helpers/Enums'

class ChecklistItemContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.changeTreeElementType = this.changeTreeElementType.bind(this)
    this.markAsFinalOrComplete = this.markAsFinalOrComplete.bind(this)
  }

  changeTreeElementType(type) {
    const updatedTreeElement = _.assign({}, this.props.treeElement, { type })
    this.props.updateTreeElement(updatedTreeElement)
  }

  markAsFinalOrComplete(e) {
    e.stopPropagation()
    const { intl, treeElement } = this.props
    if (treeElement.is_restricted) {
      return
    }
    const { createOrUpdateCompletionStatus, updateVersion } = this.props
    if (treeElement.type === 'Document') {
      if (!treeElement.attachment) {
        ErrorHandling.setErrors({
          messages: {
            errors: [
              intl.formatMessage({ id: 'category.tree_element.attachment.cannot_mark_as_final' })
            ]
          }
        })
        return
      }
      if (treeElement.attachment.latest_version.status === 'executed') {
        ErrorHandling.setErrors({
          messages: {
            errors: [
              intl.formatMessage({ id: 'category.tree_element.attachment.cannot_mark_executed_version_as_incomplete' })
            ]
          }
        })
        return
      }
      // toggle final
      const version = treeElement.attachment.latest_version
      let newVersion = _.cloneDeep(version)
      newVersion.status = version.status === 'final' ? 'draft' : 'final'
      updateVersion(treeElement, newVersion)
    } else if (treeElement.type === 'Task') {
      // toggle complete
      let completionStatus = _.clone(treeElement.completion_statuses[0]) || {is_complete: false}
      completionStatus.is_complete = !completionStatus.is_complete
      createOrUpdateCompletionStatus(treeElement, completionStatus)
    }
  }

  render() {
    const { currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, hasVotingThreshold, indentation, lastChildren, noteError, notesLoading, ongoingUploads, originalTree, parentTreeElement, publicNotes, selectedTreeElement, showUploads, teamNotes, treeElement } = this.props
    const { addNote, addTreeElement, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, deleteTreeElement, getNotes, moveTreeElement, removeEditableTreeElement, selectTreeElement, sendVersionToDms, setActiveParty, updateEditableTreeElement, updateTreeElement, updateVersion, uploadVersion } = this.props
    return (
      <ChecklistItem
        addTreeElement={addTreeElement}
        updateEditableTreeElement={updateEditableTreeElement}
        removeEditableTreeElement={removeEditableTreeElement}
        treeElement={treeElement}
        indentation={indentation}
        selectedTreeElement={selectedTreeElement}
        selectTreeElement={selectTreeElement}
        showUploads={showUploads}
        moveTreeElement={moveTreeElement}
        parentTreeElement={parentTreeElement}
        originalTree={originalTree}
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
        changeTreeElementType={this.changeTreeElementType}
        markAsFinalOrComplete={this.markAsFinalOrComplete}
        deleteTreeElement={deleteTreeElement}
        uploadVersion={uploadVersion}
        sendVersionToDms={sendVersionToDms}
        ongoingUploads={ongoingUploads}
        hasVotingThreshold={hasVotingThreshold}
      />
    )
  }

}

ChecklistItemContainer.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  hasVotingThreshold: PropTypes.bool.isRequired,
  indentation: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentTreeElement: Schema.treeElement.isRequired,
  publicNotes: PropTypes.array.isRequired,
  selectedTreeElement: Schema.treeElement,
  showUploads: PropTypes.bool.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: Schema.treeElement.isRequired,

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

export default injectIntl(ChecklistItemContainer)

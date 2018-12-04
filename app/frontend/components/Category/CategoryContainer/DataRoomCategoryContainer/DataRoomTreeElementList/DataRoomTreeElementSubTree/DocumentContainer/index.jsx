import PropTypes from 'prop-types'
import React from 'react'

import Document from './Document/index.jsx'
import Schema from 'helpers/Schema'

export default class DocumentContainer extends React.PureComponent {

  render() {
    return (
      <Document
        addTreeElement={this.props.addTreeElement}
        updateEditableTreeElement={this.props.updateEditableTreeElement}
        removeEditableTreeElement={this.props.removeEditableTreeElement}
        treeElement={this.props.treeElement}
        indentation={this.props.indentation}
        selectedTreeElement={this.props.selectedTreeElement}
        selectTreeElement={this.props.selectTreeElement}
        parentNumber={this.props.parentNumber}
        createOrUpdateCompletionStatus={this.props.createOrUpdateCompletionStatus}
        showUploads={this.props.showUploads}
        moveTreeElement={this.props.moveTreeElement}
        uploadVersion={this.props.uploadVersion}
        parentTreeElement={this.props.parentTreeElement}
        originalTree={this.props.originalTree}
        lastChildren={this.props.lastChildren}
        publicNotes={this.props.publicNotes}
        teamNotes={this.props.teamNotes}
        notesLoading={this.props.notesLoading}
        noteError={this.props.noteError}
        addNote={this.props.addNote}
        deleteNote={this.props.deleteNote}
        getNotes={this.props.getNotes}
        currentDealEntityUserIsOwner={this.props.currentDealEntityUserIsOwner}
        dmsType={this.props.dmsType}
        currentDealEntityUser={this.props.currentDealEntityUser}
        deletePlacedUploadVersion={this.props.deletePlacedUploadVersion}
      />
    )
  }

}

DocumentContainer.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  indentation: PropTypes.number.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
  parentNumber: PropTypes.string.isRequired,
  parentTreeElement: Schema.treeElement,
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
  getNotes: PropTypes.func.isRequired,
  moveTreeElement: PropTypes.func.isRequired,
  removeEditableTreeElement: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

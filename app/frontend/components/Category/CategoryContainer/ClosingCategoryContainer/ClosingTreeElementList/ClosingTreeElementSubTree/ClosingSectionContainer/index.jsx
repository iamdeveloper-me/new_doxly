import PropTypes from 'prop-types'
import React from 'react'

import ClosingSection from './ClosingSection/index.jsx'
import Schema from 'helpers/Schema'

export default class ClosingSectionContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      expanded: true
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    return (
      <ClosingSection
        addTreeElement={this.props.addTreeElement}
        updateEditableTreeElement={this.props.updateEditableTreeElement}
        removeEditableTreeElement={this.props.removeEditableTreeElement}
        treeElement={this.props.treeElement}
        expanded={this.state.expanded}
        toggle={this.toggle}
        selectedTreeElement={this.props.selectedTreeElement}
        selectTreeElement={this.props.selectTreeElement}
        showUploads={this.props.showUploads}
        moveTreeElement={this.props.moveTreeElement}
        setActiveParty={this.props.setActiveParty}
        originalTree={this.props.originalTree}
        lastChildren={this.props.lastChildren}
        publicNotes={this.props.publicNotes}
        teamNotes={this.props.teamNotes}
        notesLoading={this.props.notesLoading}
        noteError={this.props.noteError}
        addNote={this.props.addNote}
        deleteNote={this.props.deleteNote}
        getNotes={this.props.getNotes}
        currentDealEntityUser={this.props.currentDealEntityUser}
        currentDealEntityUserIsOwner={this.props.currentDealEntityUserIsOwner}
        deletePlacedUploadVersion={this.props.deletePlacedUploadVersion}
        dmsType={this.props.dmsType}
        createOrUpdateCompletionStatus={this.props.createOrUpdateCompletionStatus}
        updateTreeElement={this.props.updateTreeElement}
        updateVersion={this.props.updateVersion}
        deleteTreeElement={this.props.deleteTreeElement}
        uploadVersion={this.props.uploadVersion}
        sendVersionToDms={this.props.sendVersionToDms}
        ongoingUploads={this.props.ongoingUploads}
        hasVotingThreshold={this.props.hasVotingThreshold}
      />
    )
  }

}

ClosingSectionContainer.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  hasVotingThreshold: PropTypes.bool.isRequired,
  lastChildren: PropTypes.arrayOf(PropTypes.bool).isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  originalTree: PropTypes.arrayOf(Schema.treeElement).isRequired,
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

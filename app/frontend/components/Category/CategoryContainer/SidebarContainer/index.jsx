import PropTypes from 'prop-types'
import React from 'react'

import Schema from 'helpers/Schema'
import Sidebar from './Sidebar/index.jsx'

export default class SidebarContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'overview'
    }
    this.setSelectedTab = this.setSelectedTab.bind(this)
  }

  componentDidMount() {
    if (this.props.treeElement.id) {
      this.props.getNotes(this.props.treeElement)
    }
  }

  componentDidUpdate(prevProps) {
    const { treeElement, getNotes } = this.props
    if (treeElement.id && (prevProps.treeElement !== treeElement)) {
      getNotes(treeElement)
    }
  }

  setSelectedTab(value) {
    this.setState({ selectedTab: value })
  }

  render() {
    const { categoryType, currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, hasVotingThreshold, noteError, notesLoading, ongoingUploads, publicNotes, teamNotes, treeElement } = this.props
    const { addNote, addRestriction, addResponsibleParty, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, deleteResponsibleParty, deleteRestriction, deleteTreeElement, getNotes, initiateUploads, propagateRestrictionsToChildren, sendVersionToDms, setActiveParty, updateEditableTreeElement, updateResponsibleParty, updateRestriction, updateTreeElement, updateVersion, uploadVersion } = this.props
    const { selectedTab } = this.state

    return (
      <Sidebar
        style={styles.container}
        treeElement={treeElement}
        setSelectedTab={this.setSelectedTab}
        selectedTab={selectedTab}
        updateTreeElement={updateTreeElement}
        updateEditableTreeElement={updateEditableTreeElement}
        deleteTreeElement={deleteTreeElement}
        createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
        uploadVersion={uploadVersion}
        updateVersion={updateVersion}
        categoryType={categoryType}
        setActiveParty={setActiveParty}
        publicNotes={publicNotes}
        teamNotes={teamNotes}
        notesLoading={notesLoading}
        noteError={noteError}
        addNote={addNote}
        deleteNote={deleteNote}
        getNotes={getNotes}
        addRestriction={addRestriction}
        updateRestriction={updateRestriction}
        deleteRestriction={deleteRestriction}
        propagateRestrictionsToChildren={propagateRestrictionsToChildren}
        currentDealEntityUser={currentDealEntityUser}
        currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
        initiateUploads={initiateUploads}
        ongoingUploads={ongoingUploads}
        dmsType={dmsType}
        addResponsibleParty={addResponsibleParty}
        deleteResponsibleParty={deleteResponsibleParty}
        updateResponsibleParty={updateResponsibleParty}
        sendVersionToDms={sendVersionToDms}
        hasVotingThreshold={hasVotingThreshold}
      />
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
}

SidebarContainer.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  hasVotingThreshold: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: Schema.treeElement,

  addNote: PropTypes.func.isRequired,
  addResponsibleParty: PropTypes.func.isRequired,
  addRestriction: PropTypes.func.isRequired,
  createOrUpdateCompletionStatus: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteResponsibleParty: PropTypes.func.isRequired,
  deleteRestriction: PropTypes.func.isRequired,
  deleteTreeElement: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  initiateUploads: PropTypes.func.isRequired,
  propagateRestrictionsToChildren: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  setActiveParty: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateResponsibleParty: PropTypes.func.isRequired,
  updateRestriction: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

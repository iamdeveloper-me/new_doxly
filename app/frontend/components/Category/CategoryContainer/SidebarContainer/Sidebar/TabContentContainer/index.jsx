import PropTypes from 'prop-types'
import React from 'react'

import NotesContainer from './NotesContainer/index.jsx'
import OverviewContainer from './OverviewContainer/index.jsx'
import Schema from 'helpers/Schema'

export default class TabContentContainer extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, noteError, notesLoading, publicNotes, selectedTab, teamNotes, treeElement } = this.props
    const { addNote, addResponsibleParty, addRestriction, deleteNote, deletePlacedUploadVersion, deleteResponsibleParty, deleteRestriction, getNotes, initiateUploads, propagateRestrictionsToChildren, sendVersionToDms, setActiveParty, updateEditableTreeElement, updateResponsibleParty, updateRestriction, updateTreeElement, updateVersion, uploadVersion } = this.props

    switch (selectedTab) {
      case 'overview':
        return <OverviewContainer
                 treeElement={treeElement}
                 updateTreeElement={updateTreeElement}
                 uploadVersion={uploadVersion}
                 updateEditableTreeElement={updateEditableTreeElement}
                 updateVersion={updateVersion}
                 categoryType={categoryType}
                 setActiveParty={setActiveParty}
                 publicNotes={publicNotes}
                 teamNotes={teamNotes}
                 noteError={noteError}
                 addNote={addNote}
                 deleteNote={deleteNote}
                 getNotes={getNotes}
                 notesLoading={notesLoading}
                 addRestriction={addRestriction}
                 updateRestriction={updateRestriction}
                 deleteRestriction={deleteRestriction}
                 propagateRestrictionsToChildren={propagateRestrictionsToChildren}
                 currentDealEntityUser={currentDealEntityUser}
                 currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                 deletePlacedUploadVersion={deletePlacedUploadVersion}
                 initiateUploads={initiateUploads}
                 dmsType={dmsType}
                 addResponsibleParty={addResponsibleParty}
                 deleteResponsibleParty={deleteResponsibleParty}
                 updateResponsibleParty={updateResponsibleParty}
                 sendVersionToDms={sendVersionToDms}
               />
      case 'public_notes':
        return <NotesContainer
                 treeElement={treeElement}
                 isPublic={true}
                 notes={publicNotes}
                 error={noteError}
                 addNote={addNote}
                 deleteNote={deleteNote}
               />
      case 'team_notes':
        return <NotesContainer
                 treeElement={treeElement}
                 isPublic={false}
                 notes={teamNotes}
                 error={noteError}
                 addNote={addNote}
                 deleteNote={deleteNote}
               />
    }
  }

}

TabContentContainer.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array,
  selectedTab: PropTypes.string.isRequired,
  teamNotes: PropTypes.array,
  treeElement: Schema.treeElement.isRequired,

  addNote: PropTypes.func.isRequired,
  addResponsibleParty: PropTypes.func.isRequired,
  addRestriction: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteResponsibleParty: PropTypes.func.isRequired,
  deleteRestriction: PropTypes.func.isRequired,
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

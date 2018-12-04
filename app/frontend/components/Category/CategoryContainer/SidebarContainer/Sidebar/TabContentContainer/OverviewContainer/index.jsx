import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Colors from 'helpers/Colors'
import Document from './Documents/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import Privacy from './Privacy/index.jsx'
import ResponsiblePartyContainer from './ResponsiblePartyContainer/index.jsx'
import Routes from 'helpers/Routes'
import Schema from 'helpers/Schema'
import ToDosContainer from './ToDosContainer/index.jsx'

export default class OverviewContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      roles: [],
      isLoading: true
    }
  }

  componentDidMount() {
    this.getRoles()
  }

  getRoles() {
    const params = Params.fetch()
    Api.get(Routes.dealRoles(params.deals, ['deal_entities.entity', 'deal_entities.deal_entity_users.entity_user.user']))
      .then((roles) => {
        this.setState({ roles: roles, isLoading: false })
      })
  }

  render() {

    const { categoryType, currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, noteError, notesLoading, publicNotes, teamNotes, treeElement, updateVersion, uploadVersion } = this.props
    const { addNote, addResponsibleParty, addRestriction, deleteNote, deletePlacedUploadVersion, deleteResponsibleParty, deleteRestriction, getNotes, initiateUploads, propagateRestrictionsToChildren, sendVersionToDms, setActiveParty, updateEditableTreeElement, updateResponsibleParty, updateRestriction } = this.props
    const closingCategoryDocument = treeElement.type === 'Document' && categoryType === 'ClosingCategory'
    const responsibleParty = treeElement.id && (treeElement.type === 'Task' || closingCategoryDocument) ?
                               <ResponsiblePartyContainer
                                 treeElement={treeElement}
                                 updateEditableTreeElement={updateEditableTreeElement}
                                 setActiveParty={setActiveParty}
                                 roles={this.state.roles}
                                 addResponsibleParty={addResponsibleParty}
                                 deleteResponsibleParty={deleteResponsibleParty}
                                 updateResponsibleParty={updateResponsibleParty}
                               />
                             :
                               null

    const privacy = currentDealEntityUserIsOwner ?
                      <Privacy
                        categoryType={categoryType}
                        treeElement={treeElement}
                        roles={this.state.roles}
                        addRestriction={addRestriction}
                        updateRestriction={updateRestriction}
                        deleteRestriction={deleteRestriction}
                        propagateRestrictionsToChildren={propagateRestrictionsToChildren}
                      />
                    :
                      null

    const document = treeElement.id && _.includes(['Document', 'Task'], treeElement.type) ?
                          <Document
                            treeElement={treeElement}
                            uploadVersion={uploadVersion}
                            updateVersion={updateVersion}
                            categoryType={categoryType}
                            publicNotes={publicNotes}
                            teamNotes={teamNotes}
                            noteError={noteError}
                            addNote={addNote}
                            deleteNote={deleteNote}
                            getNotes={getNotes}
                            notesLoading={notesLoading}
                            initiateUploads={initiateUploads}
                            dmsType={dmsType}
                            currentDealEntityUser={currentDealEntityUser}
                            currentDealEntityUserIsOwner={currentDealEntityUserIsOwner}
                            deletePlacedUploadVersion={deletePlacedUploadVersion}
                            sendVersionToDms={sendVersionToDms}
                          />
                       :
                          null

    const toDos = treeElement.id ? <ToDosContainer treeElement={treeElement} /> : null
    if (this.state.isLoading) {
      return <LoadingSpinner showLoadingBox={false} />
    } else {
      return (
        <div style={styles.container}>
          {responsibleParty}
          {privacy}
          {document}
          {toDos}
        </div>
      )
    }
  }

}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    flex: '4',
    overflow: 'auto',
    backgroundColor: Colors.gray.lightest
  }
}

OverviewContainer.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
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
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

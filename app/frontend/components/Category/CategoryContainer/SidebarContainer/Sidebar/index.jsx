import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import {
  injectIntl,
  intlShape
} from 'react-intl'

import Colors from 'helpers/Colors'
import SignatureTypeDropdown from 'components/Category/CategoryContainer/SignatureTypeDropdown/index.jsx'
import Schema from 'helpers/Schema'
import TabBar from 'components/TabBar/index.jsx'
import TabContentContainer from './TabContentContainer/index.jsx'
import TreeElementActions from './TreeElementActions/index.jsx'
import TreeElementText from './TreeElementText/index.jsx'

class Sidebar extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, hasVotingThreshold, intl, noteError, notesLoading, ongoingUploads, publicNotes, selectedTab, teamNotes, treeElement } = this.props
    const { addNote, addResponsibleParty, addRestriction, createOrUpdateCompletionStatus, deleteNote, deletePlacedUploadVersion, deleteResponsibleParty, deleteRestriction, deleteTreeElement, getNotes, initiateUploads, propagateRestrictionsToChildren, sendVersionToDms, setActiveParty, setSelectedTab, updateEditableTreeElement, updateResponsibleParty, updateRestriction, updateTreeElement, updateVersion, uploadVersion } = this.props

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <TreeElementActions
            treeElement={treeElement}
            deleteTreeElement={deleteTreeElement}
            createOrUpdateCompletionStatus={createOrUpdateCompletionStatus}
            updateTreeElement={updateTreeElement}
            categoryType={categoryType}
            ongoingUploads={ongoingUploads}
          />
          <TreeElementText
            style={styles.name}
            attribute='name'
            value={treeElement.name}
            placeholder={intl.formatMessage({id: 'category.sidebar.header.item_name'})}
            treeElement={treeElement}
            updateTreeElement={updateTreeElement}
          />
          <TreeElementText
            style={styles.description}
            attribute='description'
            value={treeElement.description}
            placeholder={intl.formatMessage({id: 'category.sidebar.header.description'})}
            treeElement={treeElement}
            updateTreeElement={updateTreeElement}
          />
          {(treeElement.type === 'Document' && categoryType === 'ClosingCategory') ?
            <div style={styles.signatureType}>
              <SignatureTypeDropdown
                treeElement={treeElement}
                updateTreeElement={updateTreeElement}
                showTextOnTrigger={true}
                hasVotingThreshold={hasVotingThreshold}
              />
            </div>
          :
            null
          }
          <div style={styles.tabs}>
            <TabBar
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              tabs={[
                {
                  key: 'overview',
                  text: <FormattedMessage id='category.sidebar.tabs.overview' />
                },
                {
                  key: 'team_notes',
                  text: <FormattedMessage id='category.sidebar.tabs.team_notes' />,
                  badge: teamNotes.length > 0 ? teamNotes.length : null
                },
                {
                  key: 'public_notes',
                  text: <FormattedMessage id='category.sidebar.tabs.public_notes' />,
                  badge: publicNotes.length > 0 ? publicNotes.length : null
                }
              ]}
            />
          </div>
        </div>
        <TabContentContainer
          selectedTab={selectedTab}
          treeElement={treeElement}
          updateEditableTreeElement={updateEditableTreeElement}
          publicNotes={publicNotes}
          teamNotes={teamNotes}
          noteError={noteError}
          addNote={addNote}
          deleteNote={deleteNote}
          getNotes={getNotes}
          notesLoading={notesLoading}
          uploadVersion={uploadVersion}
          updateVersion={updateVersion}
          categoryType={categoryType}
          setActiveParty={setActiveParty}
          updateTreeElement={updateTreeElement}
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
      </div>
    )
  }

}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `2px solid ${Colors.gray.lighter}`,
    boxShadow: `-10px 0 10px -10px ${Colors.gray.lighter}`
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 12px 0 8px',
    color: Colors.gray.darkest,
    backgroundColor: Colors.background.blue,
    fontSize: '12px',
    borderBottom: `2px solid ${Colors.gray.lighter}`,
    boxShadow: `0px 5px 10px 0px ${Colors.gray.lighter}`,
    position: 'relative',
    zIndex: '1'
  },
  button: {
    alignSelf: 'flex-end',
    color: Colors.black
  },
  icon: {
    height: '20px',
    cursor: 'pointer'
  },
  name: {
    fontSize: '16px',
    padding: '12px 0 0 4px',
    color: Colors.gray.darkest
  },
  description: {
    fontSize: '12px',
    padding: '12px 0 0 4px',
    color: Colors.gray.normal,
    maxHeight: '100px',
    overflow: 'auto'
  },
  tabs: {
    paddingTop: '20px'
  },
  signatureType: {
    paddingTop: '1.6rem'
  }
}

Sidebar.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  hasVotingThreshold: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  publicNotes: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
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
  setSelectedTab: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateResponsibleParty: PropTypes.func.isRequired,
  updateRestriction: PropTypes.func.isRequired,
  updateTreeElement:  PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

export default injectIntl(Sidebar)

import Colors from 'helpers/Colors'
import  { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import SidebarVersion from './SidebarVersion/index.jsx'
import DefaultUploadButton from 'components/Category/CategoryContainer/SidebarContainer/Sidebar/TabContentContainer/OverviewContainer/Documents/DefaultUploadButton/index.jsx'
import { DmsUploadButtonDropdown } from 'components/Category/CategoryContainer/SidebarContainer/Sidebar/TabContentContainer/OverviewContainer/Documents/DmsUploadButtonDropdown/index.jsx'

export default class Attachment extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, noteError, notesLoading, publicNotes, teamNotes, treeElement } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes, openDocumentViewer, openFilePicker, sendVersionToDms, updateVersion, uploadNewVersion, uploadVersion } = this.props
    const showMarkAsFinal = (treeElement.type === 'Document') && (categoryType === 'ClosingCategory')
    const attachment = treeElement.attachment
    const version = attachment ? attachment.latest_version : null

    const uploadButton = (
      dmsType && currentDealEntityUserIsOwner ?
        <DmsUploadButtonDropdown
          dmsType={dmsType}
          uploadVersion={uploadVersion}
          uploadNewVersion={uploadNewVersion}
          sendVersionToDms={sendVersionToDms}
          openFilePicker={openFilePicker}
          version={version}
        />
      :
        <DefaultUploadButton
          uploadNewVersion={uploadNewVersion}
        />
    )

    return (
      <div>
        <div style={styles.header}>
          <div style={styles.title}>
            <FormattedMessage id='category.sidebar.document.attachment.attached_document' />
          </div>
          <div className="whiteout-ui">
            {uploadButton}
          </div>
        </div>
        {version ?
          <SidebarVersion
            version={version}
            clickFileName={openDocumentViewer}
            showVersion={true}
            showMarkAsFinal={showMarkAsFinal}
            treeElement={treeElement}
            updateVersion={updateVersion}
            categoryType={categoryType}
            publicNotes={publicNotes}
            teamNotes={teamNotes}
            noteError={noteError}
            addNote={addNote}
            deleteNote={deleteNote}
            getNotes={getNotes}
            notesLoading={notesLoading}
            dmsType={dmsType}
            currentDealEntityUser={currentDealEntityUser}
            deletePlacedUploadVersion={deletePlacedUploadVersion}
          />
        :
          null
        }
      </div>
    )
  }
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '16px'
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  invisibleDropzone: {
    height: 'auto',
    width: 'auto',
    border: 'none'
  }
}

Attachment.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  openDocumentViewer: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  updateVersion: PropTypes.func.isRequired,
  uploadNewVersion: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

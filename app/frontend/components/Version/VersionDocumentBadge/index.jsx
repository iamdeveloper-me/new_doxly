import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingDocumentBadge from 'components/Category/CategoryContainer/ClosingCategoryContainer/ClosingTreeElementList/ClosingTreeElementSubTree/ChecklistItemContainer/ChecklistItem/ClosingDocumentBadge/index.jsx'
import DataRoomDocumentBadge from 'components/Category/CategoryContainer/DataRoomCategoryContainer/DataRoomTreeElementList/DataRoomTreeElementSubTree/DocumentContainer/Document/DataRoomDocumentBadge/index.jsx'

export default class VersionDocumentBadge extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, dmsType, documentViewerAlreadyShown, noteError, notesLoading, publicNotes, statusStyle, teamNotes, treeElement, version} = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes } = this.props
    let versionBadge
    if (treeElement && treeElement.type === 'Document' && categoryType === 'DiligenceCategory') {
      versionBadge = <div style={styles.documentBadge}>
        <DataRoomDocumentBadge
          version={version}
          formattedMessage={
            <FormattedMessage
              id='category.tree_element.attachment.version.status.dataRoomVersion'
              values={{version: version.position}}
             />
           }
           treeElement={treeElement}
           documentViewerAlreadyShown={documentViewerAlreadyShown}
           publicNotes={publicNotes}
           teamNotes={teamNotes}
           notesLoading={notesLoading}
           noteError={noteError}
           addNote={addNote}
           deleteNote={deleteNote}
           getNotes={getNotes}
           statusStyle={statusStyle}
           dmsType={dmsType}
           currentDealEntityUser={currentDealEntityUser}
           deletePlacedUploadVersion={deletePlacedUploadVersion}
        />
      </div>
    } else {
      versionBadge = <div style={styles.documentBadge}>
          <ClosingDocumentBadge
            version={version}
            treeElement={treeElement}
            documentViewerAlreadyShown={documentViewerAlreadyShown}
            publicNotes={publicNotes}
            teamNotes={teamNotes}
            notesLoading={notesLoading}
            noteError={noteError}
            addNote={addNote}
            deleteNote={deleteNote}
            getNotes={getNotes}
            statusStyle={statusStyle}
            dmsType={dmsType}
            currentDealEntityUser={currentDealEntityUser}
            deletePlacedUploadVersion={deletePlacedUploadVersion}
          />
        </div>
    }
    return versionBadge
  }

}

const styles = {
  icon: {
    height: '36px'
  },
  documentBadge: {
    marginRight: '8px'
  }
}


VersionDocumentBadge.propTypes = {
  categoryType: PropTypes.string,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  noteError: PropTypes.bool,
  notesLoading: PropTypes.bool,
  publicNotes: PropTypes.array,
  statusStyle: PropTypes.object,
  teamNotes: PropTypes.array,
  treeElement: PropTypes.object,
  version: PropTypes.object.isRequired,

  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func
}

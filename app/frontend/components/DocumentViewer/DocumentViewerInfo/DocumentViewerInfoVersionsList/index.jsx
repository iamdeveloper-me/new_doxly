import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentViewerVersion from './DocumentViewerVersion/index.jsx'

export default class DocumentViewerInfoVersionsList extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, dmsType, documentViewerAlreadyShown, noteError, notesLoading, publicNotes, selectedVersionId, teamNotes, treeElement, versions } = this.props
    const { clickVersion, addNote, deleteNote, deletePlacedUploadVersion, deleteVersion, getNotes } = this.props
    return (
      <div>
        {versions.map(version => (
          <div
            key={version.id}
            style={styles.container}
            onClick={() => clickVersion(version)}
          >
            <div
              key={version.id}
              style={styles.version(selectedVersionId === version.id)}
            >
              <DocumentViewerVersion
                version={version}
                versions={versions}
                showVersion={true}
                categoryType={categoryType}
                treeElement={treeElement}
                documentViewerAlreadyShown={documentViewerAlreadyShown}
                publicNotes={publicNotes}
                teamNotes={teamNotes}
                notesLoading={notesLoading}
                noteError={noteError}
                addNote={addNote}
                deleteNote={deleteNote}
                getNotes={getNotes}
                dmsType={dmsType}
                currentDealEntityUser={currentDealEntityUser}
                deleteVersion={deleteVersion}
                deletePlacedUploadVersion={deletePlacedUploadVersion}
              />
            </div>
          </div>
        ))
        }
      </div>
    )
  }
}

const styles = {
  container: {
    cursor: 'pointer',
    borderBottom: `1px solid ${Colors.gray.lightest}`
  },
  version: isSelected => ({
    padding: '16px',
    display: 'flex',
    background: isSelected ? Colors.blue.lightest : 'transparent',
    border: `2px solid ${isSelected ? Colors.blue.normal : 'transparent'}`,
    position: 'relative'
  }),
}

DocumentViewerInfoVersionsList.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  selectedVersionId: PropTypes.number,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,
  versions: PropTypes.array.isRequired,

  addNote: PropTypes.func.isRequired,
  clickVersion: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired
}

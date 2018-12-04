import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

import VersionDate from 'components/Version/VersionDate/index.jsx'
import VersionDetails from 'components/Version/VersionDetails/index.jsx'
import VersionDocumentBadge from 'components/Version/VersionDocumentBadge/index.jsx'
import VersionPlacement from 'components/Version/VersionPlacement/index.jsx'

export default class PlacedUploadVersion extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, dmsType, documentViewerAlreadyShown, noteError, notesLoading, placed, publicNotes, teamNotes, treeElement, version } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes } = this.props

    const versionPlacement = <VersionPlacement version={version} placed={placed} />
    const versionDetails = <VersionDetails version={version} />
    const versionDate = <VersionDate version={version} />
    const versionDocumentBadge =  <VersionDocumentBadge
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
                                    version={version}
                                    dmsType={dmsType}
                                    currentDealEntityUser={currentDealEntityUser}
                                    deletePlacedUploadVersion={deletePlacedUploadVersion}
                                  />

    return (
      <div style={styles.content}>
        <div style={styles.badgeAndDate}>
          {versionDocumentBadge}
          {versionDate}
        </div>
        {versionDetails}
        {versionPlacement}
      </div>
    )
  }
}

const styles = {
  badgeAndDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontWeight: 500,
    color: Colors.gray.darker,
    fontSize: '12px',
    overflow: 'hidden',
    width: '100%'
  }
}

PlacedUploadVersion.defaultProps = {
  documentViewerAlreadyShown: false
}

PlacedUploadVersion.propTypes = {
  categoryType: PropTypes.string,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  noteError: PropTypes.bool,
  notesLoading: PropTypes.bool,
  publicNotes: PropTypes.array,
  placed: PropTypes.bool,
  teamNotes: PropTypes.array,
  treeElement: PropTypes.object,
  version: PropTypes.object.isRequired,

  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func,
}

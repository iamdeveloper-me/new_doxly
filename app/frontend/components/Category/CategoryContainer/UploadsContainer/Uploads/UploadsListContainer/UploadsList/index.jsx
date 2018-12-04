import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import PlacedUpload from './PlacedUpload/index.jsx'
import UnplacedUpload from './UnplacedUpload/index.jsx'

export default class UploadsList extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, dmsType, noteError, notesLoading, publicNotes, sortedPlacedUploads, sortedUnplacedUploads, teamNotes } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, deleteUpload, getNotes, placeUpload, setDragging } = this.props
    const placedUploads = sortedPlacedUploads.map(upload => (
      <PlacedUpload
        key={upload.id}
        categoryType={categoryType}
        upload={upload}
        setDragging={setDragging}
        publicNotes={publicNotes}
        teamNotes={teamNotes}
        notesLoading={notesLoading}
        noteError={noteError}
        addNote={addNote}
        deleteNote={deleteNote}
        getNotes={getNotes}
        dmsType={dmsType}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    ))
    const unplacedUploads = sortedUnplacedUploads.map(upload => (
      <UnplacedUpload
        key={upload.id}
        categoryType={categoryType}
        upload={upload}
        placeUpload={placeUpload}
        setDragging={setDragging}
        deleteUpload={deleteUpload}
        publicNotes={publicNotes}
        teamNotes={teamNotes}
        notesLoading={notesLoading}
        noteError={noteError}
        addNote={addNote}
        deleteNote={deleteNote}
        getNotes={getNotes}
        currentDealEntityUser={currentDealEntityUser}
        deletePlacedUploadVersion={deletePlacedUploadVersion}
      />
    ))
    return (
      <div style={styles.list}>
        {unplacedUploads}
        {placedUploads}
      </div>
    )
  }

}

const styles = {
  list: {
    height: '100%'
  }
}

UploadsList.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  sortedPlacedUploads: PropTypes.array.isRequired,
  sortedUnplacedUploads: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteUpload: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  placeUpload: PropTypes.func.isRequired,
  setDragging: PropTypes.func.isRequired
}

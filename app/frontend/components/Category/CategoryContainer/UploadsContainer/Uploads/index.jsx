import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import UploadsHeader from './UploadsHeader/index.jsx'
import UploadsListContainer from './UploadsListContainer/index.jsx'

export default class Uploads extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      sort: 'created_at'
    }
    this.setSort = this.setSort.bind(this)
  }

  setSort(sort) {
    this.setState({ sort: sort })
  }

  render() {
    const { categoryType, currentDealEntityUser, dmsType, noteError, notesLoading, ongoingUploads, placedUploads, publicNotes, teamNotes, unplacedUploads } = this.props
    const { addNote, cancelAllOngoingUploads, cancelOngoingUpload, clearAllOngoingUploads, deleteNote, deletePlacedUploadVersion, deleteUpload, getNotes, placeUpload, setDragging } = this.props
    return (
      <div style={styles.uploads}>
        <div style={styles.header}>
          <UploadsHeader
            setSort={this.setSort}
            sort={this.state.sort}
            unplacedUploadsCount={unplacedUploads.length}
          />
        </div>
        <div style={styles.list}>
          <UploadsListContainer
            categoryType={categoryType}
            sort={this.state.sort}
            placedUploads={placedUploads}
            unplacedUploads={unplacedUploads}
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
            ongoingUploads={ongoingUploads}
            cancelOngoingUpload={cancelOngoingUpload}
            cancelAllOngoingUploads={cancelAllOngoingUploads}
            clearAllOngoingUploads={clearAllOngoingUploads}
            dmsType={dmsType}
            currentDealEntityUser={currentDealEntityUser}
            deletePlacedUploadVersion={deletePlacedUploadVersion}
          />
        </div>
      </div>
    )
  }

}

const styles = {
  uploads: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    flexShrink: 0
  },
  list: {
    flex: '1',
    overflow: 'auto'
  }
}

Uploads.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  placedUploads: PropTypes.array.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  unplacedUploads: PropTypes.array.isRequired,

  addNote: PropTypes.func.isRequired,
  cancelAllOngoingUploads: PropTypes.func.isRequired,
  cancelOngoingUpload: PropTypes.func.isRequired,
  clearAllOngoingUploads: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteUpload: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  placeUpload: PropTypes.func.isRequired,
  setDragging: PropTypes.func.isRequired
}

import PropTypes from 'prop-types'
import React from 'react'

import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Uploads from './Uploads/index.jsx'

export default class UploadsContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    // only make an API call if you haven't already
    // note that this will make an API every time if they have no placed uploads
    if (this.props.placedUploads.length === 0) {
      this.getPlacedUploads()
    } else {
      this.setState({
        loading: false
      })
    }
  }

  getPlacedUploads() {
    this.props.getPlacedUploads(() => {
      this.setState({
        loading: false
      })
    })
  }

  render() {
    const { categoryType, currentDealEntityUser, dmsType, noteError, notesLoading, ongoingUploads, placedUploads, publicNotes, teamNotes, unplacedUploads} = this.props
    const { addNote, cancelAllOngoingUploads, cancelOngoingUpload, clearAllOngoingUploads, deleteNote, deletePlacedUploadVersion, deleteUpload, getNotes, placeUpload, setDragging } = this.props
    const view =  this.state.loading ?
                    <LoadingSpinner showLoadingBox={false} />
                  :
                    <Uploads
                      categoryType={categoryType}
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
    return (
      <div style={styles.uploads}>
        {view}
      </div>
    )
  }

}

const styles = {
  uploads: {
    height: '100%'
  }
}

UploadsContainer.propTypes = {
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
  getPlacedUploads: PropTypes.func.isRequired,
  placeUpload: PropTypes.func.isRequired,
  setDragging: PropTypes.func.isRequired
}

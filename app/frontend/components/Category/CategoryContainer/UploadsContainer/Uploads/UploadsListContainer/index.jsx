import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Colors from 'helpers/Colors'
import Empty from 'components/Empty/index.jsx'
import OngoingUploadsList from './OngoingUploadsList/index.jsx'
import UploadsList from './UploadsList/index.jsx'

export default class UploadsListContainer extends React.PureComponent {

  render() {
    const { categoryType, currentDealEntityUser, dmsType, noteError, notesLoading, ongoingUploads, placedUploads, publicNotes, sort, teamNotes, unplacedUploads } = this.props
    const { addNote, cancelAllOngoingUploads, cancelOngoingUpload, clearAllOngoingUploads, deleteNote, deletePlacedUploadVersion, deleteUpload, getNotes, placeUpload, setDragging } = this.props
    const order = ['created_at'].indexOf(sort) != -1 ? 'desc' : 'asc' // this is an array in case we have more sort options in the future
    const sortedPlacedUploads = _.orderBy(placedUploads, [placedUploads => placedUploads[sort].toLowerCase()], order)
    const sortedUnplacedUploads = _.orderBy(unplacedUploads, [placedUploads => placedUploads[sort].toLowerCase()], order)

    if (ongoingUploads.length > 0 || unplacedUploads.length > 0 || placedUploads.length > 0) {
      return (
        <div style={styles.listContainer}>
          <div style={styles.list}>
            {ongoingUploads.length > 0 ?
              <OngoingUploadsList
                ongoingUploads={ongoingUploads}
                cancelOngoingUpload={cancelOngoingUpload}
                cancelAllOngoingUploads={cancelAllOngoingUploads}
                clearAllOngoingUploads={clearAllOngoingUploads}
              />
            :
              null
            }
            <UploadsList
              categoryType={categoryType}
              sortedPlacedUploads={sortedPlacedUploads}
              sortedUnplacedUploads={sortedUnplacedUploads}
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
              dmsType={dmsType}
              currentDealEntityUser={currentDealEntityUser}
              deletePlacedUploadVersion={deletePlacedUploadVersion}
            />
          </div>
        </div>
      )
    } else {
      return (
        <Empty
          icon={<i className='fa fa-files-o fa-4x' aria-hidden='true'></i>}
          text={<FormattedMessage id="category.sidebar.uploads.empty" />}
        />
      )
    }
  }

}

const styles = {
  listContainer: {
    height: '100%',
    display: 'flex',
    padding: '16px'
  },
  list: {
    flexGrow: '1',
    backgroundColor: Colors.whiteout.white,
    border: `1px solid ${Colors.whiteout.gray}`,
    borderRadius: '4px',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}

UploadsListContainer.propTypes = {
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
  sort: PropTypes.string.isRequired,

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

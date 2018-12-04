import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import UnplacedUploadVersion from 'components/Category/CategoryContainer/UploadsContainer/Uploads/UploadsListContainer/UploadsList/UnplacedUpload/UnplacedUploadVersion/index.jsx'

export default class Upload extends React.PureComponent {

  render() {
    const { noteError, notesLoading, publicNotes, teamNotes, upload } = this.props
    const { addNote, deleteNote, getNotes } = this.props

    return (
      <div style={styles.container}>
        <UnplacedUploadVersion
          version={upload}
          publicNotes={publicNotes}
          teamNotes={teamNotes}
          notesLoading={notesLoading}
          noteError={noteError}
          addNote={addNote}
          deleteNote={deleteNote}
          getNotes={getNotes}
        />
      </div>
    )
  }

}

const styles = {
  container: {
    padding: '2px',
    width: '350px',
    display: 'flex',
    border: `2px solid ${Colors.blue.dark}`,
    borderRadius: '2px',
    background: 'white',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,.4)',
    opacity: '.5'
  }
}

Upload.propTypes = {
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  upload: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired
}

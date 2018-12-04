import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentViewer from 'components/DocumentViewer/index.jsx'
import PlacedUploadVersion from './PlacedUploadVersion/index.jsx'

export default class PlacedUpload extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showDocumentViewer: false
    }
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
    this.selectTreeElement = this.selectTreeElement.bind(this)
  }

  openDocumentViewer() {
    this.setState({ showDocumentViewer: true })
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  selectTreeElement() {
    // TODO: make this select the tree element
  }

  render() {
    const { categoryType, currentDealEntityUser, dmsType, noteError, notesLoading, publicNotes, teamNotes, upload } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes } = this.props
    let treeElement = upload.attachment.attachable
    treeElement.attachment = upload.attachment
    return (
      <div style={styles.container}>
        <PlacedUploadVersion
          categoryType={categoryType}
          version={upload}
          treeElement={upload.attachment.attachable}
          placed={true}
          showVersion={true}
          clickFileName={this.openDocumentViewer}
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
        {this.state.showDocumentViewer ?
          <DocumentViewer
            categoryType={categoryType}
            treeElement={treeElement}
            version={upload}
            hide={this.hideDocumentViewer}
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
            hideDocumentViewer={this.hideDocumentViewer}
          />
        :
          null
        }
      </div>
    )
  }

}

const styles = {
  container: {
    padding: '16px 16px 16px 16px',
    display: 'flex',
    borderBottom: `1px solid ${Colors.gray.lighter}`
  }
}

PlacedUpload.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  upload: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired
}

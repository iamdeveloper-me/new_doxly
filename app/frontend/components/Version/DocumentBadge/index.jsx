import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentViewer from 'components/DocumentViewer/index.jsx'

export default class DocumentBadge extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showDocumentViewer: false
    }
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
  }

  openDocumentViewer() {
    const { documentViewerAlreadyShown } = this.props

    if (!documentViewerAlreadyShown && this.attachment()) {
      this.setState({ showDocumentViewer: true })
    }
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  attachment() {
    return this.props.treeElement ? this.props.treeElement.attachment : null
  }

  render() {
    const attachment = this.attachment()
    const { categoryType, currentDealEntityUser, dmsType, formattedMessage, noteError, notesLoading, publicNotes, statusStyle, teamNotes, treeElement, version } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes } = this.props

    let documentViewerVersion = null
    if (version) {
      documentViewerVersion = version
    } else if (attachment) {
      documentViewerVersion = attachment.latest_version
    }

    return (
      <div>
        <div style={_.assign({}, styles.status, statusStyle)} onClick={this.openDocumentViewer}>
          {formattedMessage}
        </div>
        {this.state.showDocumentViewer ?
          <DocumentViewer
            treeElement={treeElement}
            version={documentViewerVersion}
            hide={this.hideDocumentViewer}
            categoryType={categoryType}
            documentViewerAlreadyShown={true}
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
  status: {
    padding: 0,
    marginRight: 0,
    height: '24px',
    fontSize: '12px',
    fontWeight: 'bold',
    border: `2px solid ${Colors.gray.light}`,
    borderRadius: '50px',
    color: Colors.gray.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
    width: '90px',
    minWidth: 0,
    background: Colors.white,
    cursor: 'pointer'
  }
}

DocumentBadge.defaultProps = {
  documentViewerAlreadyShown: false,
  version: null
}

DocumentBadge.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  formattedMessage: PropTypes.element.isRequired,
  noteError: PropTypes.bool,
  notesLoading: PropTypes.bool,
  publicNotes: PropTypes.array,
  statusStyle: PropTypes.object.isRequired,
  teamNotes: PropTypes.array,
  treeElement: PropTypes.object,
  version: PropTypes.object,

  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func
}

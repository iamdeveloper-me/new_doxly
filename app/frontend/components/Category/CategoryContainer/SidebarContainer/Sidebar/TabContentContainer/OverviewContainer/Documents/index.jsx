import _ from 'lodash'
import Dropzone from 'react-dropzone'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Attachment from './Attachment/index.jsx'
import Colors from 'helpers/Colors'
import DefaultUploadButton from './DefaultUploadButton/index.jsx'
import { DmsUploadButtonDropdown } from './DmsUploadButtonDropdown/index.jsx'
import  { DmsFilePicker } from 'components/DmsFilePicker/index.jsx'
import DocumentViewer from 'components/DocumentViewer/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'

const permissions = {
  'DiligenceCategory': {
    'Document': {
      canUploadChildDocuments: false
    }
  },
  'ClosingCategory': {
    'Document': {
      canUploadChildDocuments: true
    },
    'Task': {
      canUploadChildDocuments: true
    }
  }
}

class Document extends React.PureComponent  {

  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      uploadingNewVersion: false,
      showDocumentViewer: false,
      filePickerIsOpen: false,
      filePickerAction: ''
    }
    this.uploadNewVersion = this.uploadNewVersion.bind(this)
    this.bulkUpload = this.bulkUpload.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.toggleDrag = this.toggleDrag.bind(this)
    this.canUploadChildDocuments = this.canUploadChildDocuments.bind(this)
    this.dropNewVersion = this.dropNewVersion.bind(this)
    this.dropBulkUpload = this.dropBulkUpload.bind(this)
    this.getAttachment = this.getAttachment.bind(this)
    this.getCompletionStatus = this.getCompletionStatus.bind(this)
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
    this.openFilePicker = this.openFilePicker.bind(this)
    this.closeFilePicker = this.closeFilePicker.bind(this)
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.treeElement.attachment && this.getAttachment()) ||
        (prevProps.treeElement.attachment &&
          this.getAttachment() &&
          this.getAttachment().latest_version &&
          prevProps.treeElement.attachment.latest_version &&
          prevProps.treeElement.attachment.latest_version.id !== this.getAttachment().latest_version.id
        )) {
      this.setState({ uploadingNewVersion: false })
    }
  }

  getAttachment() {
    return this.props.treeElement.attachment
  }

  getCompletionStatus() {
    return this.props.treeElement.completion_statuses && this.props.treeElement.completion_statuses[0]
  }

  canUploadChildDocuments() {
    return permissions[this.props.categoryType][this.props.treeElement.type].canUploadChildDocuments
  }

  // file pickers
  uploadNewVersion() {
    this.newVersionDropzone.open()
  }

  bulkUpload() {
    this.bulkUploadDropzone.open()
  }

  // upload management
  onDrop(acceptedFiles, rejectedFiles) {
    // update view
    this.toggleDrag(false)

    // perform upload
    const totalNumberOfFiles = acceptedFiles.length + rejectedFiles.length
    if ((totalNumberOfFiles === 1) || !this.canUploadChildDocuments()) {
      this.dropNewVersion(acceptedFiles, rejectedFiles)
    } else if (this.canUploadChildDocuments()) {
      this.dropBulkUpload(acceptedFiles, rejectedFiles)
    }
  }

  dropNewVersion(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length > 0) {
      this.setState({ uploadingNewVersion: true })
      this.props.uploadVersion(this.props.treeElement, { file: acceptedFiles[0], errorCallback: () => this.setState({ uploadingNewVersion: false })})
      // made the below condition an else if, not an else, because in IE11, dropNewVersion was called randomly without any arguments passed in.
    } else if (rejectedFiles.length > 0) {
      App.FlashMessages.addMessage('error', this.props.intl.formatMessage({ id: 'category.sidebar.document.attachment.errors.unable_to_upload_file' }))
    }
  }

  dropBulkUpload(acceptedFiles, rejectedFiles) {
    this.props.initiateUploads(this.props.treeElement.id, acceptedFiles)
    _.each(rejectedFiles, file => ErrorHandling.setErrors(this.props.intl.formatMessage({ id: 'category.sidebar.document.errors.upload_to_upload' })))
  }

  // state management
  toggleDrag(drag = !this.state.drag) {
    this.setState({ drag })
  }

  openDocumentViewer() {
    this.setState({ showDocumentViewer: true })
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  openFilePicker(filePickerAction) {
    this.setState({
      filePickerIsOpen: true,
      filePickerAction: filePickerAction
    })
  }

  closeFilePicker() {
    this.setState({
      filePickerIsOpen: false,
      filePickerAction: ''
    })
  }

  render() {
    const { categoryType, currentDealEntityUser, currentDealEntityUserIsOwner, dmsType, intl, noteError, notesLoading, publicNotes, teamNotes, treeElement } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes, sendVersionToDms, uploadVersion } = this.props
    const attachment = this.getAttachment()
    const version = attachment ? attachment.latest_version : null
    const dragView = (
      <div className='whiteout-ui' style={styles.dragView}>
        <div style={styles.circle}>
          <i className="mdi mdi-upload"></i>
        </div>
        <p style={styles.dropMessage} className="note"><FormattedMessage id='category.sidebar.document.drop_to_upload' /></p>
      </div>
    )
    const uploadButton = (
      dmsType && currentDealEntityUserIsOwner ?
        <DmsUploadButtonDropdown
          dmsType={dmsType}
          uploadNewVersion={this.uploadNewVersion}
          uploadVersion={uploadVersion}
          sendVersionToDms={sendVersionToDms}
          openFilePicker={this.openFilePicker}
        />
      :
        <DefaultUploadButton
          uploadNewVersion={this.uploadNewVersion}
        />
    )

    const content = (
      attachment !== null ?
        <Attachment
          bulkUpload={this.bulkUpload}
          openDocumentViewer={this.openDocumentViewer}
          uploadNewVersion={this.uploadNewVersion}
          canUploadChildDocuments={this.canUploadChildDocuments}
          openFilePicker={this.openFilePicker}
          {...this.props}
        />
      :
        <div>
          <div style={styles.header}>
            <div style={styles.title}>
              <FormattedMessage id='category.sidebar.document.document' />
            </div>
            <div className="whiteout-ui">
              {uploadButton}
            </div>
          </div>
          <div className='whiteout-ui' style={styles.content}>
            <p style={styles.message} className='note'><FormattedMessage id='category.sidebar.document.upload_new_version' /></p>
          </div>
        </div>
    )

    return (
      <div style={styles.container}>
        {this.state.filePickerIsOpen ?
          <DmsFilePicker
            version={version}
            dmsType={dmsType}
            treeElement={treeElement}
            sendVersionToDms={sendVersionToDms}
            uploadVersion={uploadVersion}
            closeFilePicker={this.closeFilePicker}
            filePickerAction={this.state.filePickerAction}
          />
        :
          null
        }
        <Dropzone
          onDrop={this.dropNewVersion}
          ref={dropzone => { this.newVersionDropzone = dropzone }}
          disableClick={true}
          style={styles.invisibleDropzone}
        ></Dropzone>
        <Dropzone
          onDrop={this.dropBulkUpload}
          ref={dropzone => { this.bulkUploadDropzone = dropzone }}
          disableClick={true}
          style={styles.invisibleDropzone}
        ></Dropzone>
        <Dropzone
          onDragOver={this.dragOver}
          onDrop={this.onDrop}
          ref={dropzone => { this.dropzone = dropzone }}
          disableClick={true}
          style={_.assign({}, styles.dropzone, this.state.uploadingNewVersion ? styles.blur : {})}
          onDragEnter={() => this.toggleDrag(true)}
          onDragLeave={() => this.toggleDrag(false)}
        >
          {content}
          {this.state.drag ? dragView : null}
        </Dropzone>
        {this.state.uploadingNewVersion ?
          <div style={styles.uploading}>
            <LoadingSpinner
              loadingText={<span><FormattedMessage id='category.checklist.uploading' /></span>}
              showLoadingBox={false}
            />
          </div>
        :
          null
        }
        {this.state.showDocumentViewer ?
          <DocumentViewer
            dmsType={dmsType}
            categoryType={categoryType}
            treeElement={treeElement}
            version={version}
            hide={this.hideDocumentViewer}
            publicNotes={publicNotes}
            teamNotes={teamNotes}
            noteError={noteError}
            addNote={addNote}
            deleteNote={deleteNote}
            getNotes={getNotes}
            notesLoading={notesLoading}
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
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '16px'
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  dropzone: {
    backgroundColor: Colors.white,
    margin: '4px 0',
    padding: '20px 20px 20px 20px',
    borderTop: `1px solid ${Colors.gray.lighter}`,
    borderBottom: `1px solid ${Colors.gray.lighter}`,
    color: Colors.gray.darkest
  },
  blur: {
    filter: 'blur(4px)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 24px 24px 24px',
    textAlign: 'center'
  },
  message: {
    marginTop: '12px'
  },
  dragView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.blue.dark,
    color: Colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    borderRadius: '50%',
    height: '64px',
    width: '64px',
    color: 'white',
    backgroundColor: Colors.blue.darker,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.2rem'
  },
  dropMessage:{
    marginTop: '12px',
    color: 'white'
  },
  invisibleDropzone: {
    height: '0',
    width: '0',
    border: 'none'
  },
  uploading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(255,255,255,0.25)'
  },
  button: {
    color: Colors.button.blue,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  addIcon: {
    marginLeft: '0.8rem',
    fontSize: '1.4rem',
    background: Colors.button.blue,
    color: 'white',
    height: '1.8rem',
    width: '1.8rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
}

Document.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  currentDealEntityUserIsOwner: PropTypes.bool.isRequired,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,
  initiateUploads: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

export default injectIntl(Document)

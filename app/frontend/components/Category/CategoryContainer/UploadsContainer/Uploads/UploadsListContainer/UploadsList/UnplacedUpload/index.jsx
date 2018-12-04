import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import PropTypes from 'prop-types'
import React from 'react'

import AlertTooltip from 'components/AlertTooltip/index.jsx'
import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import DocumentViewer from 'components/DocumentViewer/index.jsx'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import UnplacedUploadVersion from './UnplacedUploadVersion/index.jsx'

class UnplacedUpload extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      loading: false,
      showDocumentViewer: false,
      showTooltip: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.deleteUpload = this.deleteUpload.bind(this)
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }

  openDocumentViewer() {
    this.setState({ showDocumentViewer: true })
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  deleteUpload() {
    this.props.deleteUpload(this.props.upload)
  }

  showTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip })
  }

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    })
  }

  render() {
    const { categoryType, currentDealEntityUser, noteError, notesLoading, isDragging, publicNotes, teamNotes, upload } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, getNotes } = this.props
    const { loading, hover, showDocumentViewer } = this.state
    const deleteIcon = hover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'

    return this.props.connectDragSource(
      <div>
        <div style={styles.dragBorder(isDragging)}>
          <div style={styles.container}>
            <div style={loading ? styles.blurFilter : styles.noBlurFilter}>
              <div style={styles.navyBorder}></div>
              <div style={styles.doc}>
                <UnplacedUploadVersion
                  version={upload}
                  placed={false}
                  clickFileName={this.openDocumentViewer}
                  publicNotes={publicNotes}
                  teamNotes={teamNotes}
                  notesLoading={notesLoading}
                  noteError={noteError}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  getNotes={getNotes}
                />
                <AlertTooltip
                  interactive={true}
                  header="Delete this document?"
                  text="Deleting will permanently remove this file from the Doxly servers."
                  showTooltip={this.state.showTooltip}
                  setShowTooltip={this.showTooltip}
                  onDelete={this.deleteUpload}
                  icon={
                    <img
                      src={Assets.getPath(deleteIcon)}
                      onClick={this.showTooltip}
                      onMouseEnter={this.onMouseEnterHandler}
                      onMouseLeave={this.onMouseLeaveHandler}
                      style={styles.deleteButton}
                    />
                  }
                />
              </div>
            </div>
          </div>
          {loading ?
            <div style={styles.loading}><LoadingSpinner showLoadingBox={false} showLoadingText={false} type="pink" /></div>
          :
            null
          }
        </div>
        {showDocumentViewer ?
          <DocumentViewer
            categoryType={categoryType}
            version={upload}
            hide={this.hideDocumentViewer}
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
        :
          null
        }
      </div>
    )
  }

}

const uploadSource = {
  beginDrag(props) {
    props.setDragging(true)
    return {
      upload: props.upload
    }
  },
  endDrag(props, monitor, component) {
    props.setDragging(false)
    if (monitor.didDrop()) {
      component.setState({ loading: true })
      props.placeUpload(monitor.getDropResult().treeElement, props.upload, () => {
        component.setState({ loading: false })
      })
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const styles = {
  dragBorder: isDragging => ({
    border: isDragging ? `2px solid ${Colors.blue.normal}` : '',
    position: 'relative'
  }),
  container: {
    borderBottom: `1px solid ${Colors.gray.lighter}`,
    cursor: 'move'
  },
  navyBorder: {
    background: Colors.whiteout.navy,
    width: '6px',
    flexShrink: 0
  },
  doc: {
    width: '100%',
    overflow: 'hidden',
    padding: '16px 16px 16px 12px',
    display: 'flex',
    alignItems: 'center'
  },
  deleteButton: {
    cursor: 'pointer',
    flexGrow: '0',
    flexShrink: '0',
    width: '30px'
  },
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(255,255,255,0.25)'
  },
  blurFilter: {
    filter: 'blur(4px)',
    display: 'flex'
  },
  noBlurFilter: {
    display: 'flex'
  }
}

UnplacedUpload.propTypes = {
  categoryType: PropTypes.string.isRequired,
  currentDealEntityUser: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  noteError: PropTypes.bool.isRequired,
  notesLoading: PropTypes.bool.isRequired,
  publicNotes: PropTypes.array.isRequired,
  teamNotes: PropTypes.array.isRequired,
  upload: PropTypes.object.isRequired,

  addNote: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteUpload: PropTypes.func.isRequired,
  getNotes: PropTypes.func.isRequired,

  // DnD
  connectDragPreview: PropTypes.func.isRequired
}

export default DragSource(DragDropItemTypes.UPLOAD, uploadSource, collect)(UnplacedUpload)

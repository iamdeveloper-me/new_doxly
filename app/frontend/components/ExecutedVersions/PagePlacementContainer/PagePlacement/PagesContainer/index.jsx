import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { arrayMove } from 'react-sortable-hoc'

import Colors from 'helpers/Colors'
import Pages from './Pages/index.jsx'

export default class PagesContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedPages: this.props.selectedDocument.pages
    }
    this.onPagesReset = this.onPagesReset.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.updateSelectedPages = this.updateSelectedPages.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { selectedDocument } = this.props

    if (prevProps.selectedDocument !== selectedDocument) {
      this.setState({ selectedPages: selectedDocument.pages })
    }
  }

  onPagesReset() {
    const { originalDocuments, selectedDocument } = this.props
    const originalDocument = _.find(originalDocuments, { document_id: selectedDocument.document_id })

    this.props.updateDocument(originalDocument.pages)
  }

  onSortEnd({oldIndex, newIndex}) {
    const originalPages = _.cloneDeep(this.state.selectedPages)

    this.props.updateDocument(arrayMove(originalPages, oldIndex, newIndex))
  }

  updateSelectedPages(page, removeFromAll) {
    const originalPages = _.cloneDeep(this.state.selectedPages)

    originalPages.map((originalPage) => {
      if (originalPage.original_position === page.original_position) {
        if (originalPage.position) {
          originalPage.position = null
        } else {
          originalPage.position = originalPage.original_position
        }
      }
      return originalPage
    })
    this.props.updateDocument(originalPages, page, removeFromAll)
  }

  render() {
    const { selectedDocument, selectedDocuments, thumbnailsLoading } = this.props
    const { setThumbnailsLoading, syncThumbnails, toggleShowPreview } = this.props
    const { selectedPages } = this.state
    const hasPageChanges =  _.find(selectedDocuments, { document_id: selectedDocument.document_id }).has_changes
    const syncButton = selectedDocument.is_on_dms ?
      <div style={styles.button(true)} onClick={syncThumbnails}>
        <FormattedMessage id='executed_versions.sync_thumbnails' />
      </div>
    :
      null
    return (
      <div style={styles.thumbnailContainer}>
        <div style={styles.header}>
          <div style={styles.name}>{selectedDocument.document_name}</div>
          <div style={styles.actionsContainer}>
            <div style={styles.button(hasPageChanges)} disabled={hasPageChanges} onClick={this.onPagesReset}>
              <FormattedMessage id='executed_versions.reset' />
            </div>
            {syncButton}
          </div>
        </div>
        <Pages
          axis={'xy'}
          pages={selectedPages}
          selectedDocuments={selectedDocuments}
          onSortEnd={this.onSortEnd}
          useDragHandle={true}
          selectedDocument={selectedDocument}
          toggleShowPreview={toggleShowPreview}
          updateSelectedPages={this.updateSelectedPages}
          thumbnailsLoading={thumbnailsLoading}
          setThumbnailsLoading={setThumbnailsLoading}
        />
      </div>
    )
  }

}

const styles = {
  thumbnailContainer: {
    flexGrow: '1',
    width: '100%',
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '10px',
    overflow: 'hidden'
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '4px',
    paddingLeft: '10px',
    color: Colors.gray.darkest
  },
  name: {
    overflow: 'hidden',
    marginRight: '20px'
  },
  button: canSelect => ({
    fontSize: '12px',
    color: canSelect ? Colors.button.blue : Colors.gray.normal,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    paddingLeft: '8px'
  }),
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}

PagesContainer.propTypes = {
  originalDocuments: PropTypes.array.isRequired,
  selectedDocument: PropTypes.object.isRequired,
  selectedDocuments: PropTypes.array.isRequired,
  thumbnailsLoading: PropTypes.bool.isRequired,

  setThumbnailsLoading: PropTypes.func.isRequired,
  toggleShowPreview: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired
}

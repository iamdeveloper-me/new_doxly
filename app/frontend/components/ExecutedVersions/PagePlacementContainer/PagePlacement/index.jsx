import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'

import Colors from 'helpers/Colors'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import PagesContainer from './PagesContainer/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import WhiteoutPdfViewer from 'components/WhiteoutPdfViewer/index.jsx'
import WhiteoutSidebar from 'components/WhiteoutSidebar/index.jsx'

export default class PagePlacement extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedPage: null,
      showPreview: false,
      sidebarList: [],
      thumbnailsLoading: false
    }
    this.onClose = this.onClose.bind(this)
    this.toggleShowPreview = this.toggleShowPreview.bind(this)
    this.updateDocument = this.updateDocument.bind(this)
    this.setSidebarList = this.setSidebarList.bind(this)
    this.syncThumbnails = this.syncThumbnails.bind(this)
    this.setThumbnailsLoading = this.setThumbnailsLoading.bind(this)
  }

  componentDidMount() {
    this.setSidebarList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.documents != this.props.documents) {
      this.setSidebarList()
    }
  }

  setSidebarList() {
    let sidebarList = []

    _.map(this.props.documents, (document) => {
      sidebarList.push(
        {
          key: document.document_id,
          name: document.document_name,
          showBadge: document.has_changes
        }
      )
    })
    this.setState({
      sidebarList: sidebarList
    })
  }

  toggleShowPreview(page) {
    this.setState({
      selectedPage: page,
      showPreview: !this.state.showPreview
    })
  }

  onClose() {
    this.setState({ showPreview: false })
  }

  setThumbnailsLoading(value) {
    this.setState({
      thumbnailsLoading: value
    })
  }

  updateDocument(pages, page, removeFromAll) {
    let originalDocument = _.cloneDeep(this.props.selectedDocument)
    originalDocument.pages = pages

    this.props.setUpdatedDocuments(originalDocument, page, removeFromAll)
  }

  syncThumbnails() {
    this.setThumbnailsLoading(true)
    const params = Params.fetch()
    const selectedDocument = _.cloneDeep(this.props.selectedDocument)
    // go sync the thumbnails to the dms
    Api.get(Routes.dealCategoryTreeElementAttachmentVersionSyncThumbnails(params.deals, selectedDocument.category_id, selectedDocument.document_id, selectedDocument.attachment_id, selectedDocument.version_id))
      .then((response) => {
        // set the new thumbnail sprite path
        selectedDocument.thumbnail_sprite_path = response.thumbnail_sprite_path
        // take all of the signature page thumbnails
        const signaturePages = _.filter(selectedDocument.pages, 'signature_page_id')
        // and combine them with the new document thumbnails
        selectedDocument.pages = _.concat(response.pages, signaturePages)
        // set the updated document in both the selected and original document state
        this.props.updateDocument(selectedDocument, { updateOriginalSelectedDocuments: true })
        this.setThumbnailsLoading(false)
      })
      .catch(error => ErrorHandling.setErrors(error, this.doneLoading()))
  }

  render() {
    const { loading, selectedPage, showPreview, sidebarList } = this.state
    const { documents, originalDocuments, selectedDocument } = this.props
    const { setSelectedDocumentId } = this.props
    if (!selectedDocument || loading) {
      return <LoadingSpinner />
    } else if (showPreview) {
      return <WhiteoutPdfViewer
               onClose={this.onClose}
               pagePath={selectedPage.preview_path}
               title={
                 <FormattedMessage
                   id='executed_versions.pdf_viewer_title'
                   values={{name: selectedDocument.document_name, page: selectedPage.position}}
                 />
                }
              />
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}><FormattedMessage id='executed_versions.custom_page_placement_description' /></div>
        <div style={styles.body}>
          <WhiteoutSidebar
            header={<FormattedMessage id='executed_versions.document_header' />}
            list={sidebarList}
            selectedItemKey={selectedDocument.document_id}
            setSelectedItemKey={setSelectedDocumentId}
          />
          <PagesContainer
            selectedDocument={selectedDocument}
            selectedDocuments={documents}
            originalDocuments={originalDocuments}
            toggleShowPreview={this.toggleShowPreview}
            updateDocument={this.updateDocument}
            syncThumbnails={this.syncThumbnails}
            thumbnailsLoading={this.state.thumbnailsLoading}
            setThumbnailsLoading={this.setThumbnailsLoading}
          />
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    color: Colors.text.gray,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    flexShrink: 0
  },
  body: {
    flexGrow: '1',
    display: 'flex',
    paddingTop: '20px',
    overflow: 'hidden'
  }
}

PagePlacement.propTypes = {
  documents: PropTypes.array.isRequired,
  originalDocuments: PropTypes.array.isRequired,

  setSelectedDocumentId: PropTypes.func.isRequired,
  setUpdatedDocuments: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired
}

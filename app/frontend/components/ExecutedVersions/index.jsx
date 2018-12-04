import _ from 'lodash'
import React from 'react'

import Api from 'helpers/Api'
import ConfirmChanges from './ConfirmChanges/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import ExecutedVersionsContainer from './ExecutedVersionsContainer/index.jsx'
import FullScreenBackdrop from 'components/FullScreenBackdrop/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import PagePlacementContainer from './PagePlacementContainer/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'

export default class ExecutedVersions extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      incompleteDocuments: [],
      readyDocuments: [],
      selectedDocuments: [],
      originalSelectedDocuments: [],
      selectedView: 'choose_documents',
      sidebarList: [],
      isReadyLoading: true,
      isIncompleteLoading: true,
      selectedDocumentId: ''
    }
    this.getIncompleteDocuments = this.getIncompleteDocuments.bind(this)
    this.getReadyDocuments = this.getReadyDocuments.bind(this)
    this.setSelectedDocuments = this.setSelectedDocuments.bind(this)
    this.setSelectedView = this.setSelectedView.bind(this)
    this.updateSelectedDocuments = this.updateSelectedDocuments.bind(this)
    this.updateDocument = this.updateDocument.bind(this)
    this.setUpdatedDocuments = this.setUpdatedDocuments.bind(this)
    this.setDocumentChanges = this.setDocumentChanges.bind(this)
    this.onRemoveSignaturePageFromAll = this.onRemoveSignaturePageFromAll.bind(this)
    this.setSelectedDocumentId = this.setSelectedDocumentId.bind(this)
  }

  componentDidMount() {
    this.getIncompleteDocuments()
    this.getReadyDocuments()
  }

  getReadyDocuments() {
    const params = Params.fetch()
    Api.get(Routes.dealDocumentsReadyToBeExecuted(params.deals))
      .then((readyDocuments) => {
        this.setState({
          readyDocuments: readyDocuments,
          isReadyLoading: false
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  getIncompleteDocuments() {
    const params = Params.fetch()
    Api.get(Routes.dealDocumentsNotReadyToBeExecuted(params.deals))
      .then((incompleteDocuments) => {
        this.setState({
          incompleteDocuments: incompleteDocuments,
          isIncompleteLoading: false
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  setSelectedDocuments(documents) {
    this.setState({
      selectedDocuments: documents,
      originalSelectedDocuments: documents,
      selectedDocumentId: documents[0].document_id
    })
  }

  setSelectedDocumentId(value) {
    this.setState({
      selectedDocumentId: value
    })
  }

  selectedDocument() {
    return _.find(this.state.selectedDocuments, { document_id: this.state.selectedDocumentId })
  }

  setSelectedView(value) {
    this.setState({
      selectedView: value
    })
  }

  updateSelectedDocuments(document) {
    let originalSelectedDocuments = _.cloneDeep(this.state.selectedDocuments)

    if (!_.find(originalSelectedDocuments, {document_id: document.document_id})) {
      originalSelectedDocuments.push(document)
    } else {
      originalSelectedDocuments = _.reject(originalSelectedDocuments, { document_id: document.document_id })
    }

    this.setState({
      selectedDocuments: originalSelectedDocuments,
      originalSelectedDocuments: originalSelectedDocuments,
      selectedDocumentId: !_.isEmpty(originalSelectedDocuments) ? originalSelectedDocuments[0].document_id : null
    })
  }

  setDocumentChanges(documents) {
    documents.map(doc => {
      let hasChanges = false
      doc.pages.map((page, index) => {
        if (!page.position || ((index + 1) != page.position)) {
          hasChanges = true
        }
      })
      _.assign(doc, { has_changes: hasChanges })
    })
    return documents
  }

  onRemoveSignaturePageFromAll(signingCapacityId) {
    let originalDocuments = _.cloneDeep(this.state.selectedDocuments)
    let updatedDocuments = []
    _.map(originalDocuments, (originalDoc) => {
      let pages = []
      _.map(originalDoc.pages, (page) => {
        if (page.signing_capacity_id === signingCapacityId) {
          page.position = null
          pages.push(page)
        } else {
          pages.push(page)
        }
      })
      originalDoc.pages = pages
      updatedDocuments.push(originalDoc)
    })
    updatedDocuments = this.setDocumentChanges(updatedDocuments)

    this.setState({
      selectedDocuments: updatedDocuments
    })
  }

  updateDocument(updatedDocument, { updateOriginalSelectedDocuments = false } = {}) {
    let selectedDocuments = _.cloneDeep(this.state.selectedDocuments)
    let originalSelectedDocuments =  _.cloneDeep(this.state.originalSelectedDocuments)
    const updateDocuments = (documents, newDocument) =>
      _.map(documents, (document) =>
        document.document_id === newDocument.document_id ?
            newDocument
          :
            document
      )

    selectedDocuments = updateDocuments(selectedDocuments, updatedDocument)
    if (updateOriginalSelectedDocuments) {
      originalSelectedDocuments = updateDocuments(originalSelectedDocuments, updatedDocument)
    }
    const updatedDocuments = this.setDocumentChanges(selectedDocuments)

    this.setState({
      selectedDocuments: updatedDocuments,
      originalSelectedDocuments: originalSelectedDocuments
    })
  }

  setUpdatedDocuments(updatedDocument, page, removeFromAll) {
    if (removeFromAll) {
      this.onRemoveSignaturePageFromAll(page.signing_capacity_id)
    } else {
      this.updateDocument(updatedDocument)
    }
  }

  render() {
    const { incompleteDocuments, isReadyLoading, isIncompleteLoading, originalSelectedDocuments, readyDocuments, selectedDocuments, selectedView, sidebarList } = this.state
    if (isReadyLoading || isIncompleteLoading) {
      return (
        <FullScreenBackdrop>
          <LoadingSpinner />
        </FullScreenBackdrop>
      )
    }

    switch (selectedView) {
      case 'choose_documents':
        return <ExecutedVersionsContainer
                 incompleteDocuments={incompleteDocuments}
                 readyDocuments={readyDocuments}
                 selectedDocuments={selectedDocuments}
                 setSelectedDocuments={this.setSelectedDocuments}
                 setSelectedView={this.setSelectedView}
                 updateSelectedDocuments={this.updateSelectedDocuments}
               />
      case 'page_placement':
        return <PagePlacementContainer
                 selectedDocuments={selectedDocuments}
                 sidebarList={sidebarList}
                 originalSelectedDocuments={originalSelectedDocuments}
                 setSelectedView={this.setSelectedView}
                 setUpdatedDocuments={this.setUpdatedDocuments}
                 updateDocument={this.updateDocument}
                 selectedDocument={this.selectedDocument()}
                 setSelectedDocumentId={this.setSelectedDocumentId}
               />
      case 'confirm_changes':
        return <ConfirmChanges
                 documents={selectedDocuments}
                 setSelectedView={this.setSelectedView}
               />
    }

  }
}

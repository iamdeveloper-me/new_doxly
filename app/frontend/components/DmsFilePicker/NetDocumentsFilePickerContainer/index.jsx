import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import ErrorHandling from 'helpers/ErrorHandling'
import FilePicker from 'components/DmsFilePicker/FilePicker/index.jsx'
import { FILE_PICKER_ACTIONS } from 'components/Category/CategoryContainer/SidebarContainer/Sidebar/TabContentContainer/OverviewContainer/Documents/DmsUploadButtonDropdown/index.jsx'
import NetDocumentsBreadcrumbs from './NetDocumentsBreadcrumbs/index.jsx'
import NetDocumentsCabinet from './NetDocumentsCabinet/index.jsx'
import NetDocumentsDocument from './NetDocumentsDocument/index.jsx'
import NetDocumentsFolder from './NetDocumentsFolder/index.jsx'
import NetDocumentsResourceProperties from './NetDocumentsResourceProperties/index.jsx'
import NetDocumentsSaveAs from './NetDocumentsSaveAs/index.jsx'
import NetDocumentsSearchContainer from './NetDocumentsSearchContainer/index.jsx'
import NetDocumentsWorkspace from './NetDocumentsWorkspace/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import { SAVE_AS_TYPES } from 'components/DmsFilePicker/index.jsx'

const SIDEBAR_ITEM_KEYS = {
  cabinets: 'cabinets',
  favorite_workspaces: 'favorite_workspaces',
  recent_workspaces: 'recent_workspaces',
  recent_documents: 'recent_documents'
}

const RESOURCE_EXTENSIONS = {
  folder: 'ndfld'
}

const RESOURCE_TYPES = {
  cabinets: 'cabinets',
  folders: 'folders',
  folder_contents: 'folder_contents',
  search_results: 'search_results',
  workspaces: 'workspaces'
}

class NetDocumentsFilePickerContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      resources: [],
      resourceType: '',
      ancestors: [],
      saveAsType: this.props.filePickerAction === FILE_PICKER_ACTIONS.export ? SAVE_AS_TYPES.new_document : '',
      newDocumentName: this.getNewDocumentName(),
      searchQuery: '',
      versions: [],
      currentVersionNumber: '',
      currentlySelectedDocumentEnvId: '',
      currentlySelectedSidebarKey: '',
      currentSidebarRoot: '',
      loading: false
    }
    this.setSaveAsType = this.setSaveAsType.bind(this)
    this.setNewDocumentName = this.setNewDocumentName.bind(this)
    this.setSearchQuery = this.setSearchQuery.bind(this)
    this.setCurrentVersionNumber = this.setCurrentVersionNumber.bind(this)
    this.getCabinets = this.getCabinets.bind(this)
    this.buildCabinetComponents = this.buildCabinetComponents.bind(this)
    this.getCabinetFolders = this.getCabinetFolders.bind(this)
    this.getFolderContents = this.getFolderContents.bind(this)
    this.getWorkspaceDocuments = this.getWorkspaceDocuments.bind(this)
    this.getDocument = this.getDocument.bind(this)
    this.onSave = this.onSave.bind(this)
    this.saveEnabled = this.saveEnabled.bind(this)
    this.search = this.search.bind(this)
    this.onBack = this.onBack.bind(this)
    this.hideLoading = this.hideLoading.bind(this)
  }

  getNewDocumentName() {
    let fileName = _.get(this.props.version, 'file_name')
    if (!fileName) {
      return null
    }
    let fileNameArray = fileName.split('.')
    fileNameArray.pop()
    return fileNameArray.join('.')
  }

  getSidebarItems() {
    return [
      {
        name: <FormattedMessage id='file_picker.net_documents.cabinets' />,
        imagePath: "net-documents-cabinet.svg",
        onClick: () => this.getCabinets(), // must be an anonymous function or else "this" isn't defined.
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.cabinets
      },
      {
        name: <FormattedMessage id='file_picker.net_documents.favorite_workspaces' />,
        imagePath: "net-documents-workspace.svg",
        onClick: () => this.getWorkspaces(SIDEBAR_ITEM_KEYS.favorite_workspaces),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.favorite_workspaces
      },
      {
        name: <FormattedMessage id='file_picker.net_documents.recent_workspaces' />,
        imagePath: "net-documents-workspace.svg",
        onClick: () => this.getWorkspaces(SIDEBAR_ITEM_KEYS.recent_workspaces),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.recent_workspaces
      },
      {
        name: <FormattedMessage id='file_picker.net_documents.recent_documents' />,
        iconPath: "file-document",
        onClick: () => this.getRecentDocuments(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.recent_documents
      }
    ]
  }

  setSaveAsType(saveAsType) {
    const currentlySelectedDocumentEnvId = saveAsType === SAVE_AS_TYPES.new_document ? '' : this.state.currentlySelectedDocumentEnvId
    this.setState({ saveAsType, currentlySelectedDocumentEnvId })
  }

  setNewDocumentName(newDocumentName) {
    this.setState({ newDocumentName })
  }

  setSearchQuery(searchQuery) {
    this.setState({ searchQuery })
  }

  setCurrentVersionNumber(currentVersionNumber) {
    this.setState({ currentVersionNumber })
  }

  showLoading() {
    this.setState({
      loading: true
    })
  }

  hideLoading() {
    this.setState({
      loading: false
    })
  }

  getCabinets() {
    const params = Params.fetch()
    this.showLoading()
    Api.get(Routes.netDocumentsApi.cabinets(params.deals))
      .then((cabinets) => {
        this.setState({
          resources: cabinets,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.cabinets,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.cabinets,
          ancestors: [],
          resourceType: RESOURCE_TYPES.cabinets,
          currentlySelectedDocumentEnvId: '',
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getCabinetFolders(cabinet) {
    const params = Params.fetch()
    this.showLoading()
    Api.get(Routes.netDocumentsApi.cabinetFolders(params.deals, cabinet.id))
      .then((folders) => {
        this.setState({
          resources: folders,
          currentlySelectedSidebarKey: '',
          ancestors: [cabinet],
          resourceType: RESOURCE_TYPES.folders,
          currentlySelectedDocumentEnvId: '',
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getFolderContents(folder, { back = false } = {}) {
    this.showLoading()
    const params = Params.fetch()
    Api.get(Routes.netDocumentsApi.folder(params.deals, folder.envId))
      .then((resources) => {
        let newAncestors = _.cloneDeep(this.state.ancestors)
        if (back) {
          newAncestors = _.dropRight(newAncestors, 1)
        } else {
          newAncestors = _.concat(this.state.ancestors, folder)
        }
        this.setState({
          resources: resources,
          currentlySelectedSidebarKey: '',
          ancestors: newAncestors,
          resourceType: RESOURCE_TYPES.folder_contents,
          currentlySelectedDocumentEnvId: '',
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getDocument(envId) {
    this.showLoading()
    // Decided to get the document with the versions instead of just the versions because in the UI, the user is clicking on a document.
    // Also, now we will have the document if we want it for the future.
    const params = Params.fetch()
    Api.get(Routes.netDocumentsApi.document(params.deals, encodeURIComponent(envId)))
      .then((document) => {
        const versions = document.docVersions.version
        const versionNumbers = versions.map((version) => {
          return version.number
        })
        this.setState({
          currentlySelectedDocumentEnvId: envId,
          versions: document.docVersions.version,
          currentVersionNumber: versionNumbers.sort(function(a, b) {return b- a})[0],
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getWorkspaces(type) {
    this.showLoading()
    const params = Params.fetch()
    Api.get(Routes.netDocumentsApi.workspaces(params.deals, type))
      .then((workspaces) => {
        this.setState({
          resources: workspaces,
          ancestors: [],
          resourceType: RESOURCE_TYPES.workspaces,
          currentlySelectedDocumentEnvId: '',
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS[type],
          currentSidebarRoot: SIDEBAR_ITEM_KEYS[type],
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getWorkspaceDocuments(id) {
    this.showLoading()
    const params = Params.fetch()
    Api.get(Routes.netDocumentsApi.workspace(params.deals, encodeURIComponent(id)))
      .then((resources) => {
        const currentResources = _.cloneDeep(this.state.resources)
        let workspace = _.find(currentResources, {id: id})
        this.setState({
          resources: resources,
          currentlySelectedSidebarKey: '',
          ancestors: _.concat(this.state.ancestors, workspace),
          resourceType: RESOURCE_TYPES.folder_contents,
          currentlySelectedDocumentEnvId: '',
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getRecentDocuments() {
    this.showLoading()
    const params = Params.fetch()
    Api.get(Routes.netDocumentsApi.recentlyAccessedDocuments(params.deals))
      .then((documents) => {
        this.setState({
          resources: documents,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.recent_documents,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.recent_documents,
          ancestors: [],
          resourceType: RESOURCE_TYPES.folder_contents,
          currentlySelectedDocumentEnvId: '',
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  search() {
    if (this.state.searchQuery.length < 2) {
      ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'file_picker.search_query_must_be_at_least_two_characters_long'})]}})
    } else {
      this.showLoading()
      const params = Params.fetch()
      Api.get(Routes.netDocumentsApi.search(params.deals, this.state.searchQuery))
        .then((documents) => {
          this.setState({
            resources: documents,
            currentlySelectedSidebarKey: '',
            ancestors: [],
            resourceType: RESOURCE_TYPES.search_results,
            currentlySelectedDocumentEnvId: '',
            loading: false
          })
        })
        .catch(error => {
          this.hideLoading()
          ErrorHandling.setErrors(error)
        })
    }
    }


  onSave() {
    if (this.props.filePickerAction === FILE_PICKER_ACTIONS.import) {
      this.importFromNetDocuments()
    } else if (this.props.filePickerAction === FILE_PICKER_ACTIONS.export) {
      this.uploadToNetDocuments()
    }
  }

  onBack() {
    const newFinalAncestor = this.state.ancestors[this.state.ancestors.length - 2]
    if (newFinalAncestor) {
      if (newFinalAncestor.envId) {
        this.getFolderContents(newFinalAncestor, { back: true })
      } else if (newFinalAncestor.id) {
        this.getCabinetFolders(newFinalAncestor)
      }
    } else if (this.state.ancestors.length === 1) {
      if (this.state.currentSidebarRoot) {
        switch(this.state.currentSidebarRoot) {
          case SIDEBAR_ITEM_KEYS.cabinets:
            this.getCabinets()
            break
          case SIDEBAR_ITEM_KEYS.recent_workspaces:
            this.getWorkspaces(SIDEBAR_ITEM_KEYS.recent_workspaces)
            break
          case SIDEBAR_ITEM_KEYS.favorite_workspaces:
            this.getWorkspaces(SIDEBAR_ITEM_KEYS.favorite_workspaces)
        }
      } else {
        this.search()
      }
    }
  }

  importFromNetDocuments() {
    const currentlySelectedResource = _.find(_.cloneDeep(this.state.resources), {envId: this.state.currentlySelectedDocumentEnvId})
    let currentlySelectedVersion = _.find(_.cloneDeep(this.state.versions), {number: this.state.currentVersionNumber})
    currentlySelectedVersion.document = currentlySelectedResource
    this.props.uploadVersion(this.props.treeElement, {dmsObject: currentlySelectedVersion})
    this.props.closeFilePicker()
  }

  uploadToNetDocuments() {
    const { ancestors, currentlySelectedDocumentEnvId, newDocumentName, saveAsType } = this.state
    const { treeElement, version } = this.props
    const documentName = saveAsType === SAVE_AS_TYPES.new_document ? newDocumentName : ''
    this.props.sendVersionToDms(
      treeElement,
      version,
      saveAsType,
      {
        documentId: encodeURIComponent(currentlySelectedDocumentEnvId),
        documentName: documentName,
        destinationId: _.get(_.last(ancestors),'envId')
      }
    )
    this.props.closeFilePicker()
  }

  buildResourceComponents() {
    switch(this.state.resourceType) {
      case RESOURCE_TYPES.cabinets:
        return this.buildCabinetComponents()
      case RESOURCE_TYPES.workspaces:
        return this.buildWorkspaceComponents()
      case RESOURCE_TYPES.folders:
        return this.buildFolderComponents()
      case RESOURCE_TYPES.folder_contents:
        return this.buildFolderContentsComponents()
      case RESOURCE_TYPES.search_results:
        return this.buildFolderContentsComponents()
      default:
        return []
    }
  }

  buildCabinetComponents() {
    return this.state.resources.map((cabinet, index) => {
      return (
        <NetDocumentsCabinet
          key={index}
          cabinet={cabinet}
          getCabinetFolders={this.getCabinetFolders}
        />
      )
    })
  }

  buildWorkspaceComponents() {
    return this.state.resources.map((workspace, index) => {
      return (
        <NetDocumentsWorkspace
          key={index}
          workspace={workspace}
          getWorkspaceDocuments={this.getWorkspaceDocuments}
        />
      )
    })
  }

  buildFolderComponents() {
    return this.state.resources.map((folder, index) => {
      return (
        <NetDocumentsFolder
          key={index}
          folder={folder}
          getFolderContents={this.getFolderContents}
        />
      )
    })
  }

  buildFolderContentsComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.extension === RESOURCE_EXTENSIONS.folder) {
        return(
          <NetDocumentsFolder
            key={index}
            folder={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      } else {
        return (
          <NetDocumentsDocument
            currentlySelectedDocumentEnvId={this.state.currentlySelectedDocumentEnvId}
            key={index}
            document={resource}
            filePickerAction={this.props.filePickerAction}
            getDocument={this.getDocument}
            saveAsType={this.state.saveAsType}
          />
        )
      }
    })
  }

  saveEnabled() {
    const { filePickerAction } = this.props
    const { currentlySelectedDocumentEnvId, currentlySelectedSidebarKey, resourceType, saveAsType } = this.state
    const importing = filePickerAction === FILE_PICKER_ACTIONS.import
    const exporting = filePickerAction === FILE_PICKER_ACTIONS.export

    const importingFromNetDocs = () => importing && currentlySelectedDocumentEnvId

    const exportingAsNewVersion = () => {
      const newVersion = saveAsType == SAVE_AS_TYPES.new_version
      return (exporting && newVersion && currentlySelectedDocumentEnvId)
    }

    const exportingAsNewDocument = () => {
      const isFolder = resourceType === RESOURCE_TYPES.folder_contents
      const isSearch = resourceType === RESOURCE_TYPES.search_results
      const resourceTypeDocumentsOrFolders = (isFolder || isSearch)
      const newDocument = saveAsType == SAVE_AS_TYPES.new_document
      const recentDocuments = currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.recent_documents
      const searchResults = resourceType === RESOURCE_TYPES.search_results
      return (exporting && newDocument && !currentlySelectedDocumentEnvId && resourceTypeDocumentsOrFolders && !recentDocuments && !searchResults)
    }
    return importingFromNetDocs() || exportingAsNewVersion() || exportingAsNewDocument()
  }

  backButtonIsActive() {

  }

  render() {
    return (
      <FilePicker
        resourceComponents={this.buildResourceComponents()}
        saveAs={
          <NetDocumentsSaveAs
            saveAsType={this.state.saveAsType}
            setSaveAsType={this.setSaveAsType}
          />
        }
        saveAsType={this.state.saveAsType}
        breadcrumbs={
          <NetDocumentsBreadcrumbs
            ancestors={this.state.ancestors}
            currentSidebarRoot={this.state.currentSidebarRoot}
          />
        }
        searchContainer={
          <NetDocumentsSearchContainer
            searchQuery={this.state.searchQuery}
            setSearchQuery={this.setSearchQuery}
            search={this.search}
          />
        }
        dmsLogoPath='net-documents.jpeg'
        filePickerAction={this.props.filePickerAction}
        sidebarItems={this.getSidebarItems()}
        currentlySelectedSidebarKey={this.state.currentlySelectedSidebarKey}
        newDocumentName={this.state.newDocumentName}
        setNewDocumentName={this.setNewDocumentName}
        closeFilePicker={this.props.closeFilePicker}
        resourceProperties={this.props.filePickerAction === FILE_PICKER_ACTIONS.import ?
          <NetDocumentsResourceProperties
            versions={this.state.versions}
            currentVersionNumber={this.state.currentVersionNumber}
            setCurrentVersionNumber={this.setCurrentVersionNumber}
            currentlySelectedDocumentEnvId={this.state.currentlySelectedDocumentEnvId}
            resources={this.state.resources}
          />
        :
          null
        }
        onSave={this.onSave}
        currentlySelectedDocumentEnvId={this.state.currentlySelectedDocumentEnvId}
        saveEnabled={this.saveEnabled}
        onBack={this.onBack}
        backButtonIsActive={!_.isEmpty(this.state.ancestors)}
        loading={this.state.loading}
        resourceType={this.state.resourceType}
      />
    )
  }
}

NetDocumentsFilePickerContainer.propTypes = {
  filePickerAction: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  treeElement: PropTypes.object.isRequired,
  version: PropTypes.object,

  closeFilePicker: PropTypes.func.isRequired,
  sendVersionToDms: PropTypes.func.isRequired,
  uploadVersion: PropTypes.func.isRequired
}

NetDocumentsFilePickerContainer = injectIntl(NetDocumentsFilePickerContainer)
export { NetDocumentsFilePickerContainer, RESOURCE_TYPES, SIDEBAR_ITEM_KEYS }

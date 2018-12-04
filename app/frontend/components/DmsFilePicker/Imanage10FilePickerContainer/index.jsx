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
import Imanage10Breadcrumbs from './Imanage10Breadcrumbs/index.jsx'
import Imanage10Document from './Imanage10Document/index.jsx'
import Imanage10DocumentShortcut from './Imanage10DocumentShortcut/index.jsx'
import Imanage10Folder from './Imanage10Folder/index.jsx'
import Imanage10FolderShortcut from './Imanage10FolderShortcut/index.jsx'
import Imanage10ResourceProperties from './Imanage10ResourceProperties/index.jsx'
import Imanage10SaveAs from './Imanage10SaveAs/index.jsx'
import Imanage10SearchContainer from './Imanage10SearchContainer/index.jsx'
import Imanage10Workspace from './Imanage10Workspace/index.jsx'
import Imanage10WorkspaceShortcut from './Imanage10WorkspaceShortcut/index.jsx'
// import Imanage10Workspace from './Imanage10Workspace/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'

const SIDEBAR_ITEM_KEYS = {
  document_worklist: 'document_worklist',
  matter_worklist: 'matter_worklist',
  my_matters: 'my_matters',
  my_favorites: 'my_favorites'
}

const SAVE_AS_TYPES = {
  new_document: 'new_document',
  new_version: 'new_version'
}

const RESOURCE_TYPES = {
  workspaces: 'workspaces',
  folders: 'folders',
  folder_contents: 'folder_contents',
  shortcuts: 'shortcuts',
  search_results: 'search_results'
}

const RESOURCE_EXTENSIONS = {
  folder: 'folder',
  document: 'document',
  tab: 'Tab',
  workspace: 'workspace'
}

class Imanage10FilePickerContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      resources: [],
      resourceType: '',
      ancestors: [],
      saveAsType: SAVE_AS_TYPES.new_document,
      newDocumentName: this.getNewDocumentName(),
      searchQuery: '',
      versions: [],
      currentVersionNumber: '',
      currentlySelectedDocument: null, // needs to be an actual object to make dealing with shortcuts consistent. This is a departure from the NetDocuments Code.
      currentlySelectedSidebarKey: '',
      currentSidebarRoot: '',
      loading: false
    }
    this.setSaveAsType = this.setSaveAsType.bind(this)
    this.setNewDocumentName = this.setNewDocumentName.bind(this)
    this.setSearchQuery = this.setSearchQuery.bind(this)
    this.setCurrentVersionNumber = this.setCurrentVersionNumber.bind(this)
    this.getWorkspaceContents = this.getWorkspaceContents.bind(this)
    this.getFolderContents = this.getFolderContents.bind(this)
    this.getDocumentVersions = this.getDocumentVersions.bind(this)
    this.onSave = this.onSave.bind(this)
    this.saveEnabled = this.saveEnabled.bind(this)
    this.search = this.search.bind(this)
    this.onBack = this.onBack.bind(this)
    this.getMatterWorklist = this.getMatterWorklist.bind(this)
    this.getMyMatters = this.getMyMatters.bind(this)
    this.getMyFavorites = this.getMyFavorites.bind(this)
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
        name: <FormattedMessage id='file_picker.imanage10.document_worklist' />,
        imagePath: "imanage-recent-documents.svg",
        onClick: () => this.getDocumentWorklist(), // must be an anonymous function or else "this" isn't defined.
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.document_worklist
      },
      {
        name: <FormattedMessage id='file_picker.imanage10.matter_worklist' />,
        imagePath: "imanage-matter-workspace.svg",
        onClick: () => this.getMatterWorklist(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.matter_worklist
      },
      {
        name: <FormattedMessage id='file_picker.imanage10.my_matters' />,
        imagePath: "imanage-matter-workspace.svg",
        onClick: () => this.getMyMatters(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.my_matters
      },
      {
        name: <FormattedMessage id='file_picker.imanage10.my_favorites' />,
        imagePath: "imanage-favorites.svg",
        onClick: () => this.getMyFavorites(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.my_favorites
      }
    ]
  }

  setSaveAsType(saveAsType) {
    const currentlySelectedDocument = saveAsType === SAVE_AS_TYPES.new_document ? null : this.state.currentlySelectedDocument
    this.setState({ currentlySelectedDocument, saveAsType })
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

  getDocumentWorklist() {
    const params = Params.fetch()
    this.showLoading()
    Api.get(Routes.imanage10Api.documentWorklist(params.deals))
      .then((documents) => {
        this.setState({
          resources: documents,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.document_worklist,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.document_worklist,
          ancestors: [],
          resourceType: RESOURCE_TYPES.folder_contents,
          currentlySelectedDocument: null,
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getMatterWorklist() {
    const params = Params.fetch()
    this.showLoading()
    Api.get(Routes.imanage10Api.matterWorklist(params.deals))
      .then((workspaces) => {
        this.setState({
          resources: workspaces,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.matter_worklist,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.matter_worklist,
          ancestors: [],
          resourceType: RESOURCE_TYPES.workspaces,
          currentlySelectedDocument: null,
          loading: false,
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getMyMatters() {
    const params = Params.fetch()
    this.showLoading()
    Api.get(Routes.imanage10Api.myMatters(params.deals))
      .then((workspaces) => {
        this.setState({
          resources: workspaces,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.my_matters,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.my_matters,
          ancestors: [],
          resourceType: RESOURCE_TYPES.shortcuts,
          currentlySelectedDocument: null,
          loading: false,
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getMyFavorites() {
    const params = Params.fetch()
    this.showLoading()
    Api.get(Routes.imanage10Api.myFavorites(params.deals))
      .then((favorites) => {
        this.setState({
          resources: favorites,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.my_favorites,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.my_favorites,
          ancestors: [],
          resourceType: RESOURCE_TYPES.shortcuts,
          currentlySelectedDocument: null,
          loading: false,
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getWorkspaceContents(workspace, {back = false } = {}) {
    this.showLoading()
    const params = Params.fetch()
    Api.get(Routes.imanage10Api.workspace(params.deals, workspace.id))
      .then((resources) => {
        let newAncestors = _.cloneDeep(this.state.ancestors)
        if (back) {
          newAncestors.pop()
        } else {
          newAncestors.push(workspace)
        }
        this.setState({
          resources: resources,
          currentlySelectedSidebarKey: '',
          ancestors: newAncestors,
          resourceType: RESOURCE_TYPES.folders,
          currentlySelectedDocument: null,
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
    Api.get(Routes.imanage10Api.folder(params.deals, folder.id))
      .then((resources) => {
        let newAncestors = _.cloneDeep(this.state.ancestors)
        if (back) {
          newAncestors.pop()
        } else {
          newAncestors.push(folder)
        }
        this.setState({
          resources: resources,
          currentlySelectedSidebarKey: '',
          ancestors: newAncestors,
          resourceType: RESOURCE_TYPES.folder_contents,
          currentlySelectedDocument: null,
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getDocumentVersions(id) {
    this.showLoading()
    const params = Params.fetch()
    Api.get(Routes.imanage10Api.versionsList(params.deals, encodeURIComponent(id)))
      .then((document) => {
        const versions = document.versions
        const versionNumbers = versions.map((version) => {
          return version.version
        })
        this.setState({
          currentlySelectedDocument: document,
          versions: versions,
          currentVersionNumber: versionNumbers.sort(function(a, b) {return b - a})[0],
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
      Api.get(Routes.imanage10Api.search(params.deals, this.state.searchQuery))
        .then((documents) => {
          this.setState({
            resources: documents,
            currentlySelectedSidebarKey: '',
            ancestors: [],
            resourceType: RESOURCE_TYPES.search_results,
            currentlySelectedDocument: null,
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
      this.importFromImanage10()
    } else if (this.props.filePickerAction === FILE_PICKER_ACTIONS.export) {
      this.uploadToImanage10()
    }
  }

  onBack() {
    const newFinalAncestor = this.state.ancestors[this.state.ancestors.length - 2]
    if (newFinalAncestor) {
      this.getFolderContents(newFinalAncestor, { back: true })
    } else if (this.state.ancestors.length === 1) {
      if (this.state.currentSidebarRoot) {
        switch(this.state.currentSidebarRoot) {
          case SIDEBAR_ITEM_KEYS.matter_worklist:
            this.getMatterWorklist()
            break
          case SIDEBAR_ITEM_KEYS.my_matters:
            this.getMyMatters()
            break
          case SIDEBAR_ITEM_KEYS.my_favorites:
            this.getMyFavorites()
        }
      } else {
        this.search()
      }
    }
  }

  importFromImanage10() {
    let currentlySelectedVersion = _.find(_.cloneDeep(this.state.versions), {version: this.state.currentVersionNumber})
    currentlySelectedVersion.document = this.state.currentlySelectedDocument
    this.props.uploadVersion(this.props.treeElement, {dmsObject: currentlySelectedVersion})
    this.props.closeFilePicker()
  }

  uploadToImanage10() {
    const { ancestors, currentlySelectedDocument, currentVersionNumber, newDocumentName, saveAsType, versions } = this.state
    const { treeElement, version } = this.props
    const currentlySelectedVersion = _.cloneDeep(_.find(versions, {VersionLabel: currentVersionNumber }))
    const versionDmsId = _.get(currentlySelectedVersion, 'id')
    const documentName = saveAsType === SAVE_AS_TYPES.new_document ? newDocumentName : ''
    if (documentName.length === 0 && saveAsType === SAVE_AS_TYPES.new_document) {
      ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'file_picker.document_name_must_be_present'})]}})
    } else {
      this.props.sendVersionToDms(
        treeElement,
        version,
        saveAsType,
        {
          documentId: encodeURIComponent(_.get(currentlySelectedDocument, 'id')),
          documentName: documentName,
          destinationId: _.get(_.last(ancestors),'id'),
          versionDmsId: versionDmsId,
          documentObject: currentlySelectedDocument
        }
      )
      this.props.closeFilePicker()
    }
  }

  buildResourceComponents() {
    switch(this.state.resourceType) {
      case RESOURCE_TYPES.workspaces:
        return this.buildWorkspaceComponents()
      case RESOURCE_TYPES.folders:
        return this.buildFolderComponents()
      case RESOURCE_TYPES.folder_contents:
        return this.buildFolderContentsComponents()
      case RESOURCE_TYPES.shortcuts:
        return this.buildShortcutComponents()
      case RESOURCE_TYPES.search_results:
        return this.buildSearchResultsComponents()
      default:
        return []
    }
  }

  buildWorkspaceComponents() {
    return this.state.resources.map((workspace, index) => {
      return (
        <Imanage10Workspace
          key={index}
          workspace={workspace}
          getWorkspaceContents={this.getWorkspaceContents}
        />
      )
    })
  }

  buildFolderComponents() {
    return this.state.resources.map((folder, index) => {
      return (
        <Imanage10Folder
          key={index}
          folder={folder}
          getFolderContents={this.getFolderContents}
        />
      )
    })
  }

  buildFolderContentsComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.wstype === RESOURCE_EXTENSIONS.folder || resource.wstype === RESOURCE_EXTENSIONS.tab) {
        return(
          <Imanage10Folder
            key={index}
            folder={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      } else {
        return (
          <Imanage10Document
            currentlySelectedDocument={this.state.currentlySelectedDocument}
            key={index}
            document={resource}
            filePickerAction={this.props.filePickerAction}
            getDocumentVersions={this.getDocumentVersions}
          />
        )
      }
    })
  }

  buildShortcutComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.target.wstype === RESOURCE_EXTENSIONS.workspace) {
        return (
          <Imanage10WorkspaceShortcut
            key={index}
            workspaceShortcut={resource}
            getWorkspaceContents={this.getWorkspaceContents}
          />
        )
      } else if (resource.target.wstype === RESOURCE_EXTENSIONS.folder) {
        return (
          <Imanage10FolderShortcut
            key={index}
            folder={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      } else if (resource.target.wstype === RESOURCE_EXTENSIONS.document) {
        return(
          <Imanage10DocumentShortcut
            currentlySelectedDocument={this.state.currentlySelectedDocument}
            key={index}
            documentShortcut={resource}
            filePickerAction={this.props.filePickerAction}
            getDocumentVersions={this.getDocumentVersions}
          />
        )
      }
    })
  }

  buildSearchResultsComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.wstype === RESOURCE_EXTENSIONS.document) {
        return (
          <Imanage10Document
            currentlySelectedDocument={this.state.currentlySelectedDocument}
            key={index}
            document={resource}
            filePickerAction={this.props.filePickerAction}
            getDocumentVersions={this.getDocumentVersions}
          />
        )
      } else {
        return (
          <Imanage10Workspace
            key={index}
            workspace={resource}
            getWorkspaceContents={this.getWorkspaceContents}
          />
        )
      }
    })
  }

  saveEnabled() {
    const { filePickerAction } = this.props
    const { currentlySelectedDocument, currentlySelectedSidebarKey, resourceType, saveAsType } = this.state
    const importing = filePickerAction === FILE_PICKER_ACTIONS.import
    const exporting = filePickerAction === FILE_PICKER_ACTIONS.export

    const importingFromImanage10 = () => importing && currentlySelectedDocument


    const exportingAsNewVersion = () => {
      const newVersion = saveAsType == SAVE_AS_TYPES.new_version
      return exporting && newVersion  && currentlySelectedDocument
    }

    const exportingAsNewDocument = () => {
      const newDocument = saveAsType == SAVE_AS_TYPES.new_document
      const recentDocuments = currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.document_worklist
      const isFolders = resourceType === RESOURCE_TYPES.folder_contents
      const isSearch = resourceType === RESOURCE_TYPES.search_results
      return (exporting && newDocument  && !currentlySelectedDocument && isFolders && !isSearch && !recentDocuments)
    }
    return (importingFromImanage10() || exportingAsNewVersion() || exportingAsNewDocument())
  }

  backButtonIsActive() {

  }

  render() {
    return (
      <FilePicker
        resourceComponents={this.buildResourceComponents()}
        saveAs={
          <Imanage10SaveAs
            saveAsType={this.state.saveAsType}
            setSaveAsType={this.setSaveAsType}
          />
        }
        saveAsType={this.state.saveAsType}
        breadcrumbs={
          <Imanage10Breadcrumbs
            ancestors={this.state.ancestors}
          />
        }
        searchContainer={
          <Imanage10SearchContainer
            searchQuery={this.state.searchQuery}
            setSearchQuery={this.setSearchQuery}
            search={this.search}
          />
        }
        dmsLogoPath='imanage.png'
        filePickerAction={this.props.filePickerAction}
        sidebarItems={this.getSidebarItems()}
        currentlySelectedSidebarKey={this.state.currentlySelectedSidebarKey}
        newDocumentName={this.state.newDocumentName}
        setNewDocumentName={this.setNewDocumentName}
        closeFilePicker={this.props.closeFilePicker}
        resourceProperties={this.props.filePickerAction === FILE_PICKER_ACTIONS.import ?
          <Imanage10ResourceProperties
            resourceType={this.state.resourceType}
            versions={this.state.versions}
            currentVersionNumber={this.state.currentVersionNumber}
            setCurrentVersionNumber={this.setCurrentVersionNumber}
            currentlySelectedDocument={this.state.currentlySelectedDocument}
          />
        :
          null
        }
        onSave={this.onSave}
        currentlySelectedDocument={this.state.currentlySelectedDocument}
        saveEnabled={this.saveEnabled}
        onBack={this.onBack}
        backButtonIsActive={!_.isEmpty(this.state.ancestors)}
        loading={this.state.loading}
        resourceType={this.state.resourceType}
      />
    )
  }
}

Imanage10FilePickerContainer.propTypes = {
  sendVersionToDms: PropTypes.func.isRequired
}

Imanage10FilePickerContainer = injectIntl(Imanage10FilePickerContainer)
export { Imanage10FilePickerContainer, RESOURCE_EXTENSIONS, RESOURCE_TYPES, SIDEBAR_ITEM_KEYS }

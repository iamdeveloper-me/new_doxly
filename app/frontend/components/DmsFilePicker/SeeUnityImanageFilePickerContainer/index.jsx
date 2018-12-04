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
import { SAVE_AS_TYPES } from 'components/DmsFilePicker/index.jsx'
import SeeUnityImanageBreadcrumbs from './SeeUnityImanageBreadcrumbs/index.jsx'
import SeeUnityImanageContentShortcut from './SeeUnityImanageContentShortcut/index.jsx'
import SeeUnityImanageDocument from './SeeUnityImanageDocument/index.jsx'
import SeeUnityImanageFolder from './SeeUnityImanageFolder/index.jsx'
import SeeUnityImanageDocumentResourceProperties from './SeeUnityImanageDocumentResourceProperties/index.jsx'
import SeeUnityImanageSaveAs from './SeeUnityImanageSaveAs/index.jsx'
import SeeUnityImanageSearchContainer from './SeeUnityImanageSearchContainer/index.jsx'
import SeeUnityImanageWorkspace from './SeeUnityImanageWorkspace/index.jsx'
// import SeeUnityImanageWorkspace from './SeeUnityImanageWorkspace/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'

const SIDEBAR_ITEM_KEYS = {
  document_worklist: 'document_worklist',
  matter_worklist: 'matter_worklist',
  my_matters: 'my_matters',
  my_favorites: 'my_favorites'
}

const RESOURCE_TYPES = {
  workspaces: 'workspaces',
  folder_contents: 'folder_contents',
  my_favorites: 'my_favorites',
  search_results: 'search_results'
}

const RESOURCE_EXTENSIONS = {
  content_shortcut: 'Content Shortcut',
  folder: 'Folder',
  link_folder: 'Link Folder',
  tab: 'Tab',
  workspace: 'Workspace',
  workspace_shortcut: 'Workspace Shortcut',
  search_folder: 'Search Folder'
}

class SeeUnityImanageFilePickerContainer extends React.PureComponent {
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
      currentlySelectedDocumentEID: '',
      currentlySelectedSidebarKey: '',
      currentSidebarRoot: '',
      loading: false,
      newComment: ''
    }
    this.setSaveAsType = this.setSaveAsType.bind(this)
    this.setNewDocumentName = this.setNewDocumentName.bind(this)
    this.setNewComment = this.setNewComment.bind(this)
    this.setSearchQuery = this.setSearchQuery.bind(this)
    this.setCurrentVersionNumber = this.setCurrentVersionNumber.bind(this)
    this.getFolderContents = this.getFolderContents.bind(this)
    this.getDocumentVersions = this.getDocumentVersions.bind(this)
    this.onSave = this.onSave.bind(this)
    this.saveEnabled = this.saveEnabled.bind(this)
    this.search = this.search.bind(this)
    this.onBack = this.onBack.bind(this)
    this.getDocumentWorklist = this.getDocumentWorklist.bind(this)
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
        name: <FormattedMessage id='file_picker.see_unity_imanage.document_worklist' />,
        imagePath: "imanage-recent-documents.svg",
        onClick: () => this.getDocumentWorklist(), // must be an anonymous function or else "this" isn't defined.
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.document_worklist
      },
      {
        name: <FormattedMessage id='file_picker.see_unity_imanage.matter_worklist' />,
        imagePath: "imanage-matter-workspace.svg",
        onClick: () => this.getMatterWorklist(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.matter_worklist
      },
      {
        name: <FormattedMessage id='file_picker.see_unity_imanage.my_matters' />,
        imagePath: "imanage-matter-workspace.svg",
        onClick: () => this.getMyMatters(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.my_matters
      },
      {
        name: <FormattedMessage id='file_picker.see_unity_imanage.my_favorites' />,
        imagePath: "imanage-favorites.svg",
        onClick: () => this.getMyFavorites(),
        isSelected: this.state.currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.my_favorites
      }
    ]
  }

  setSaveAsType(saveAsType) {
    const currentlySelectedDocumentEID = saveAsType === SAVE_AS_TYPES.new_document ? '' : this.state.currentlySelectedDocumentEID
    this.setState({ saveAsType, currentlySelectedDocumentEID })
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
    Api.get(Routes.seeUnityImanageApi.documentWorklist(params.deals))
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
    Api.get(Routes.seeUnityImanageApi.matterWorklist(params.deals))
      .then((workspaces) => {
        this.setState({
          resources: workspaces,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.matter_worklist,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.matter_worklist,
          ancestors: [],
          resourceType: RESOURCE_TYPES.workspaces,
          currentlySelectedDocumentEID: '',
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
    Api.get(Routes.seeUnityImanageApi.myMatters(params.deals))
      .then((workspaces) => {
        this.setState({
          resources: workspaces,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.my_matters,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.my_matters,
          ancestors: [],
          resourceType: RESOURCE_TYPES.workspaces,
          currentlySelectedDocumentEID: '',
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
    Api.get(Routes.seeUnityImanageApi.myFavorites(params.deals))
      .then((favorites) => {
        this.setState({
          resources: favorites,
          currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.my_favorites,
          currentSidebarRoot: SIDEBAR_ITEM_KEYS.my_favorites,
          ancestors: [],
          resourceType: RESOURCE_TYPES.my_favorites,
          currentlySelectedDocumentEID: '',
          loading: false,
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
    Api.get(Routes.seeUnityImanageApi.folder(params.deals, folder.EID))
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
          currentlySelectedDocumentEID: '',
          loading: false
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getDocumentVersions(EID) {
    this.showLoading()
    // Decided to get the document with the versions instead of just the versions because in the UI, the user is clicking on a document.
    // Also, now we will have the document if we want it for the future.
    const params = Params.fetch()
    Api.get(Routes.seeUnityImanageApi.versionsList(params.deals, encodeURIComponent(EID)))
      .then((versions) => {
        const versionNumbers = versions.map((version) => {
          return version.VersionLabel
        })
        const currentlySelectedResource = _.find(_.cloneDeep(this.state.resources), {EID: EID})
        const newComment = currentlySelectedResource.Properties ?
            _.find(currentlySelectedResource.Properties, { Field: 'imProfileComment'}).Value
          :
            ''
        this.setState({
          currentlySelectedDocumentEID: EID,
          versions: versions,
          currentVersionNumber: versionNumbers.sort(function(a, b) {return b - a})[0],
          loading: false,
          newComment: newComment
        })
      })
      .catch(error => {
        this.hideLoading()
        ErrorHandling.setErrors(error)
      })
  }

  getRecentDocuments() {
    // this.showLoading()
    // const params = Params.fetch()
    // Api.get(Routes.netDocumentsApi.recentlyAccessedDocuments(params.deals))
    //   .then((documents) => {
    //     this.setState({
    //       resources: documents,
    //       currentlySelectedSidebarKey: SIDEBAR_ITEM_KEYS.recent_documents,
    //       currentSidebarRoot: SIDEBAR_ITEM_KEYS.recent_documents,
    //       ancestors: [],
    //       resourceType: RESOURCE_TYPES.folder_contents,
    //       currentlySelectedDocumentEID: '',
    //       loading: false
    //     })
    //   })
    //   .catch(error => {
    //     this.setState({
    //       loading: false
    //     })
    //     ErrorHandling.setErrors(error)
    //   })
  }

  search() {
    if (this.state.searchQuery.length < 2) {
      ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'file_picker.search_query_must_be_at_least_two_characters_long'})]}})
    } else {
      this.showLoading()
      const params = Params.fetch()
      Api.get(Routes.seeUnityImanageApi.search(params.deals, this.state.searchQuery))
        .then((searchResults) => {
          const results = searchResults ? searchResults : []
          this.setState({
            resources: results,
            currentlySelectedSidebarKey: '',
            ancestors: [],
            resourceType: RESOURCE_TYPES.search_results,
            currentlySelectedDocumentEID: '',
            loading: false,
            currentSidebarRoot: ''
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
      this.importFromSeeUnityImanage()
    } else if (this.props.filePickerAction === FILE_PICKER_ACTIONS.export) {
      this.uploadToSeeUnityImanage()
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

  importFromSeeUnityImanage() {
    let currentlySelectedVersion = _.find(_.cloneDeep(this.state.versions), {VersionLabel: this.state.currentVersionNumber})
    currentlySelectedVersion.document = this.currentlySelectedDocument()
    this.props.uploadVersion(this.props.treeElement, {dmsObject: currentlySelectedVersion})
    this.props.closeFilePicker()
  }

  uploadToSeeUnityImanage() {
    const { ancestors, currentlySelectedDocumentEID, currentVersionNumber, newDocumentName, saveAsType, versions } = this.state
    const { treeElement, version } = this.props
    const currentlySelectedVersion = _.cloneDeep(_.find(versions, { version: currentVersionNumber }))
    const versionDmsId = _.get(currentlySelectedVersion, 'id')
    const currentlySelectedResource = this.currentlySelectedResource()
    const nameToSend = saveAsType === SAVE_AS_TYPES.new_version ? currentlySelectedResource["Name"] : newDocumentName
    if (newDocumentName.length === 0) {
      ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'file_picker.document_name_must_be_present'})]}})
    } else {
      this.props.sendVersionToDms(
        treeElement,
        version,
        saveAsType,
        {
          documentId: encodeURIComponent(currentlySelectedDocumentEID),
          documentName: nameToSend,
          destinationId: _.get(_.last(ancestors),'EID'),
          versionDmsId: versionDmsId,
          documentObject: this.currentlySelectedResource(),
          comment: this.state.newComment
        }
      )
      this.props.closeFilePicker()
    }
  }

  buildResourceComponents() {
    switch(this.state.resourceType) {
      case RESOURCE_TYPES.workspaces:
        return this.buildWorkspaceComponents()
      case RESOURCE_TYPES.folder_contents:
        return this.buildFolderContentsComponents()
      case RESOURCE_TYPES.my_favorites:
        return this.buildMyFavoritesComponents()
      case RESOURCE_TYPES.search_results:
        return this.buildSearchResultsComponents()
      default:
        return []
    }
  }

  getCurrentDocument() {
    if(this.state.currentlySelectedDocumentEID && this.state.resourceType === RESOURCE_TYPES.my_favorites) {
      if (!_.isEmpty(this.currentlySelectedResource().document)) {
        return this.currentlySelectedResource().document
      } else {
        const params = Params.fetch()
        const targetNumber = _.find(this.currentlySelectedResource().Properties, { Field: "TargetNumber" }).Value
        Api.get(Routes.seeUnityImanageApi.search(params.deals, targetNumber))
          .then((results) => {
            const document = results[0]
            let newResources = _.cloneDeep(this.state.resources)
            let currentlySelectedResource = _.find(newResources, {EID: this.state.currentlySelectedDocumentEID})
            currentlySelectedResource.document = document
            this.setState({
              resources: newResources
            })
          })
        return null
      }
    } else {
      return this.currentlySelectedResource()
    }
  }

  buildWorkspaceComponents() {
    return this.state.resources.map((workspace, index) => {
      return (
        <SeeUnityImanageWorkspace
          key={index}
          workspace={workspace}
          getFolderContents={this.getFolderContents}
        />
      )
    })
  }

  buildFolderComponents() {
    // return this.state.resources.map((folder, index) => {
    //   return (
    //     <SeeUnityImanageFolder
    //       key={index}
    //       folder={folder}
    //       getFolderContents={this.getFolderContents}
    //     />
    //   )
    // })
  }

  buildSearchResultsComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.Extension === RESOURCE_EXTENSIONS.workspace) {
        return(
          <SeeUnityImanageWorkspace
            key={index}
            workspace={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      } else {
        return (
          <SeeUnityImanageDocument
            currentlySelectedDocumentEID={this.state.currentlySelectedDocumentEID}
            key={index}
            document={resource}
            filePickerAction={this.props.filePickerAction}
            saveAsType={this.state.saveAsType}
            getDocumentVersions={this.getDocumentVersions}
          />
        )
      }
    })
  }

  currentlySelectedResource() {
    return _.find(_.cloneDeep(this.state.resources), {EID: this.state.currentlySelectedDocumentEID})
  }

  currentlySelectedDocument() {
    return ( this.state.resourceType === RESOURCE_TYPES.my_favorites ?
      this.currentlySelectedResource().document
    :
      this.currentlySelectedResource()
    )
  }

  buildFolderContentsComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.Extension === RESOURCE_EXTENSIONS.folder || resource.Extension === RESOURCE_EXTENSIONS.tab || resource.Extension === RESOURCE_EXTENSIONS.search_folder || resource.IsContainer) {
        return(
          <SeeUnityImanageFolder
            key={index}
            folder={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      } else {
        return (
          <SeeUnityImanageDocument
            currentlySelectedDocumentEID={this.state.currentlySelectedDocumentEID}
            key={index}
            document={resource}
            filePickerAction={this.props.filePickerAction}
            saveAsType={this.state.saveAsType}
            getDocumentVersions={this.getDocumentVersions}
          />
        )
      }
    })
  }

  buildMyFavoritesComponents() {
    return this.state.resources.map((resource, index) => {
      if (resource.Extension === RESOURCE_EXTENSIONS.workspace_shortcut) {
        return (
          <SeeUnityImanageWorkspace
            key={index}
            workspace={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      } else if (resource.Extension === RESOURCE_EXTENSIONS.content_shortcut) {
        return (
          <SeeUnityImanageContentShortcut
            currentlySelectedDocumentEID={this.state.currentlySelectedDocumentEID}
            key={index}
            contentShortcut={resource}
            filePickerAction={this.props.filePickerAction}
            getDocumentVersions={this.getDocumentVersions}
            saveAsType={this.state.saveAsType}
          />
        )
      } else {
        return(
          <SeeUnityImanageFolder
            key={index}
            folder={resource}
            getFolderContents={this.getFolderContents}
          />
        )
      }
    })
  }

  saveEnabled() {
    const { filePickerAction } = this.props
    const { currentlySelectedDocumentEID, currentlySelectedSidebarKey, resourceType, saveAsType,  } = this.state
    const importing = filePickerAction === FILE_PICKER_ACTIONS.import
    const exporting = filePickerAction === FILE_PICKER_ACTIONS.export

    const importingFromSeeUnityImanage = () => importing && currentlySelectedDocumentEID


    const exportingAsNewVersion = () => {
      const saveAsNewVersion = saveAsType == SAVE_AS_TYPES.new_version
      return (exporting && saveAsNewVersion && currentlySelectedDocumentEID)
    }


    const exportingAsNewDocument = () => {
      const saveAsNewDocument = saveAsType == SAVE_AS_TYPES.new_document
      const isFolders = resourceType === RESOURCE_TYPES.folder_contents
      const isSearchResults = resourceType === RESOURCE_TYPES.search_results
      const isFolderOrSearchResults = (isFolders || isSearchResults)
      const recentDocuments = currentlySelectedSidebarKey === SIDEBAR_ITEM_KEYS.recent_documents
      const searchResults = resourceType === RESOURCE_TYPES.search_results
      const folderIsWorkspace = this.state.ancestors.extension === RESOURCE_EXTENSIONS.workspace
      return (exporting && saveAsNewDocument && !currentlySelectedDocumentEID && isFolderOrSearchResults && !recentDocuments && !searchResults && !folderIsWorkspace)
    }

    return importingFromSeeUnityImanage() || exportingAsNewVersion() || exportingAsNewDocument()
  }

  setNewComment(newComment){
    this.setState({
      newComment
    })
  }

  render() {
    return (
      <FilePicker
        resourceComponents={this.buildResourceComponents()}
        saveAs={
          <SeeUnityImanageSaveAs
            saveAsType={this.state.saveAsType}
            setSaveAsType={this.setSaveAsType}
          />
        }
        saveAsType={this.state.saveAsType}
        breadcrumbs={
          <SeeUnityImanageBreadcrumbs
            ancestors={this.state.ancestors}
          />
        }
        searchContainer={
          <SeeUnityImanageSearchContainer
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
        newComment={this.state.newComment}
        setNewComment={this.setNewComment}
        closeFilePicker={this.props.closeFilePicker}
        resourceProperties={this.props.filePickerAction === FILE_PICKER_ACTIONS.import ?
          <SeeUnityImanageDocumentResourceProperties
            versions={this.state.versions}
            currentVersionNumber={this.state.currentVersionNumber}
            setCurrentVersionNumber={this.setCurrentVersionNumber}
            currentlySelectedDocumentEID={this.state.currentlySelectedDocumentEID}
            resource={this.getCurrentDocument()}
          />
        :
          null
        }
        onSave={this.onSave}
        currentlySelectedDocumentEID={this.state.currentlySelectedDocumentEID}
        saveEnabled={this.saveEnabled}
        onBack={this.onBack}
        backButtonIsActive={!_.isEmpty(this.state.ancestors)}
        loading={this.state.loading}
        resourceType={this.state.resourceType}
      />
    )
  }
}

SeeUnityImanageFilePickerContainer.propTypes = {
  sendVersionToDms: PropTypes.func.isRequired
}

SeeUnityImanageFilePickerContainer = injectIntl(SeeUnityImanageFilePickerContainer)
export { SeeUnityImanageFilePickerContainer, RESOURCE_EXTENSIONS, RESOURCE_TYPES, SIDEBAR_ITEM_KEYS }

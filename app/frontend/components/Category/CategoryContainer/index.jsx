import _ from 'lodash'
import { Button } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { DragDropContext } from 'react-dnd'
import FileSaver from 'file-saver'
import HTML5Backend from 'react-dnd-html5-backend'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Api from 'helpers/Api'
import ClosingCategoryContainer from './ClosingCategoryContainer/index.jsx'
import ChecklistDragLayer from './ChecklistDragLayer/index.jsx'
import Colors from 'helpers/Colors'
import DataRoomCategoryContainer from './DataRoomCategoryContainer/index.jsx'
import Error from 'components/Error/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import { ProductContext, can } from 'components/ProductContext/index.jsx'
import ReservedContainer from './ReservedContainer/index.jsx'
import Routes from 'helpers/Routes'
import Sidebar from 'components/Whiteout/Sidebar/index.jsx'
import SidebarContainer from './SidebarContainer/index.jsx'
import UploadsContainer from './UploadsContainer/index.jsx'

const DMS_TYPES = {
  net_documents: 'net_documents',
  see_unity_imanage: 'see_unity_imanage',
  imanage10: 'imanage10'
}

class CategoryContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      tree: [],
      categoryType: '',
      filteredTree: [],
      filter: {},
      selectedTreeElement: null,
      searchQuery: '',
      showUploads: false,
      unplacedUploads: [],
      placedUploads: [],
      draggingUpload: false,
      error: false,
      publicNotes: [],
      teamNotes: [],
      notesLoading: false,
      noteError: false,
      currentDealEntityUserIsOwner: false,
      currentDealEntityUser: {},
      dmsType: '',
      features: {},

      // Upload Management
      ongoingUploads: [],
      deal: {}
    }
    this.getCurrentDealEntityUser = this.getCurrentDealEntityUser.bind(this)
    this.getTree = this.getTree.bind(this)
    this.search = this.search.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.selectTreeElement = this.selectTreeElement.bind(this)
    this.toggleUploads = this.toggleUploads.bind(this)
    this.setDragging = this.setDragging.bind(this)
    this.deleteTreeElement = this.deleteTreeElement.bind(this)
    this.updateTreeElement = this.updateTreeElement.bind(this)
    this.addTreeElement = this.addTreeElement.bind(this)
    this.insertEditableTreeElement = this.insertEditableTreeElement.bind(this)
    this.updateEditableTreeElement = this.updateEditableTreeElement.bind(this)
    this.removeEditableTreeElement = this.removeEditableTreeElement.bind(this)
    this.placeUpload = this.placeUpload.bind(this)
    this.moveTreeElement = this.moveTreeElement.bind(this)
    this.getPlacedUploads = this.getPlacedUploads.bind(this)
    this.deleteUpload = this.deleteUpload.bind(this)
    this.createOrUpdateCompletionStatus = this.createOrUpdateCompletionStatus.bind(this)
    this.uploadVersion = this.uploadVersion.bind(this)
    this.updateVersion = this.updateVersion.bind(this)
    this.setActiveParty = this.setActiveParty.bind(this)
    this.getNotes = this.getNotes.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    this.addNote = this.addNote.bind(this)
    this.addRestriction = this.addRestriction.bind(this)
    this.updateRestriction = this.updateRestriction.bind(this)
    this.deleteRestriction = this.deleteRestriction.bind(this)
    this.propagateRestrictionsToChildren = this.propagateRestrictionsToChildren.bind(this)
    this.addTreeElement = _.debounce(this.addTreeElement, 250)
    this.addResponsibleParty = this.addResponsibleParty.bind(this)
    this.updateResponsibleParty = this.updateResponsibleParty.bind(this)
    this.deleteResponsibleParty = this.deleteResponsibleParty.bind(this)
    this.sendVersionToDms = this.sendVersionToDms.bind(this)
    this.exportChecklistInWord = this.exportChecklistInWord.bind(this)
    this.deletePlacedUploadVersion = this.deletePlacedUploadVersion.bind(this)

    // Upload Management
    this.initiateUploads = this.initiateUploads.bind(this)
    this.performUpload = this.performUpload.bind(this)
    this.moveCompletedUploads = this.moveCompletedUploads.bind(this)
    this.cancelOngoingUpload = this.cancelOngoingUpload.bind(this)
    this.cancelAllOngoingUploads = this.cancelAllOngoingUploads.bind(this)
    this.clearAllOngoingUploads = this.clearAllOngoingUploads.bind(this)
    setInterval(this.moveCompletedUploads, 5000) // move completed uploads every 5 seconds
  }

  componentDidMount() {
    this.getCurrentDealEntityUser()
    this.getTree()
  }

  /* Fetching */
  getCurrentDealEntityUser() {
    const params = Params.fetch()
    Api.get(Routes.dealCurrentDealEntityUser(params.deals, ['deal_entity.deal.dms_deal_storage_details']))
      .then((currentDealEntityUser) => {
        this.setState({
          features:  _.get(currentDealEntityUser, 'deal_entity.deal.features'),
          currentDealEntityUserIsOwner: currentDealEntityUser.deal_entity.is_owner,
          currentDealEntityUser,
          dmsType: this.getDmsType(_.get(currentDealEntityUser, 'deal_entity.deal.dms_deal_storage_details.dms_deal_storage_detailable_type'))
        })
      })
  }

  getTree() {
    const params = Params.fetch()
    Api.get(Routes.dealCategory(params.deals, params.categories, ['attachment.latest_version.uploader.user', 'attachment.latest_version.uploader.entity', 'attachment.latest_version.version_storageable', 'completion_statuses', 'responsible_parties.deal_entity.entity', 'responsible_parties.deal_entity_user.entity_user.user', 'responsible_parties.deal_entity.deal_entity_users.entity_user.user', 'tree_element_restrictions']))
      .then((categories) => {
        const category = categories[0]
        let filter = this.state.filter
        if (_.size(filter) === 0) {
          filter = category.type === 'DiligenceCategory' ? {filters:['show_all_documents']} : {parties:['show_all_parties'], documents:['show_all_documents']}
        }
        const tree = category.type === 'DiligenceCategory' ? this._setCompletionNumbersForWholeChecklist(category.children) : category.children
        this.setState({
          deal: category.owner,
          categoryType: category.type,
          filter: filter,
          loading: false,
          tree: tree,
          filteredTree: this.filterTree(_.cloneDeep(category.children), this.state.searchQuery, filter)
        })

        this.getUnplacedUploads()
      })
  }

  getNotes(treeElement) {
    const publicNotes = []
    const teamNotes = []
    const params = Params.fetch()
    Api.get(Routes.dealCategoryTreeElementNotes(params.deals, params.categories, treeElement.id, ['entity_user.user']))
      .then((notes) => {
        notes.map((note) => {
          note.is_public ? publicNotes.push(note) : teamNotes.push(note)
        })
        this.setState({
          publicNotes: publicNotes,
          teamNotes: teamNotes,
          notesLoading: false,
          noteError: false
        })
      })
      .catch(() => {
        ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'category.sidebar.notes.errors.unable_to_load_notes'})]}})
      })
  }

  addNote(note, treeElement) {
    let originalPublicNotes = _.cloneDeep(this.state.publicNotes)
    let originalTeamNotes = _.cloneDeep(this.state.teamNotes)

    const params = Params.fetch()
    Api.post(Routes.dealCategoryTreeElementNotes(params.deals, params.categories, treeElement.id, ['entity_user.user']), note)
      .then((note) => {
        note.is_public ? originalPublicNotes.push(note) : originalTeamNotes.push(note)

        this.setState({
          publicNotes: originalPublicNotes,
          teamNotes: originalTeamNotes
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  deleteNote(note, treeElement) {
    let originalPublicNotes = _.cloneDeep(this.state.publicNotes)
    let originalTeamNotes = _.cloneDeep(this.state.teamNotes)
    const isPublic = note.is_public

    const params = Params.fetch()
    Api.delete(Routes.dealCategoryTreeElementNote(params.deals, params.categories, treeElement.id, note.id))
      .then(() => {
        isPublic ?
          originalPublicNotes = _.reject(originalPublicNotes, note)
        :
          originalTeamNotes = _.reject(originalTeamNotes, note)

        this.setState({
          publicNotes: originalPublicNotes,
          teamNotes: originalTeamNotes
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  addRestriction(newRestriction, inheritedRestrictions, treeElement) {
    const prevState = _.cloneDeep(this.state) // to be used to revert if necessary

    /* OPTIMISTIC UPDATING */
    // find tree and tree element
    const originalTree = _.cloneDeep(this.state.tree)
    const { tree, index } = this._findTreeElement(originalTree, treeElement)

    // add new restrictions
    const newRestrictions = _.concat(tree[index].tree_element_restrictions, newRestriction, inheritedRestrictions)
    tree[index].tree_element_restrictions = newRestrictions

    // update state
    this._updateEditableState(originalTree, tree[index])
    /* API CALL + CORRECTING OPTIMISTIC UPDATES */
    const params = Params.fetch()
    Api.post(Routes.dealCategoryTreeElementRestrictions(params.deals, params.categories, treeElement.id), newRestriction)
      .then((restrictionsResponse) => {
        // find tree, tree element, and restriction
        const originalTree = _.cloneDeep(this.state.tree)
        const { tree, index } = this._findTreeElement(originalTree, treeElement)
        const restrictions = tree[index].tree_element_restrictions
        _.each(restrictionsResponse, restrictionResponse => {
          const restrictionIndex = _.findIndex(restrictions, { restrictable_id: restrictionResponse.restrictable_id, restrictable_type: restrictionResponse.restrictable_type })

          // replace the temporary restriction with the real one
          restrictions.splice(restrictionIndex, 1, restrictionResponse)
        })

        // update state
        this._updateEditableState(originalTree, tree[index])
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  updateRestriction(restriction, treeElement) {
    const prevState = _.cloneDeep(this.state)

    /* OPTIMISTIC UPDATING */
    // find tree, tree element, and restriction
    const originalTree = _.cloneDeep(this.state.tree)
    const { tree, index } = this._findTreeElement(originalTree, treeElement)
    const restrictions = tree[index].tree_element_restrictions
    const restrictionIndex = _.findIndex(restrictions, { restrictable_id: restriction.restrictable_id, restrictable_type: restriction.restrictable_type })

    // insert the new tree element where the editable one was
    restrictions.splice(restrictionIndex, 1, restriction)
    tree[index].tree_element_restrictions = restrictions

    // update state
    this._updateEditableState(originalTree, tree[index])

    /* API CALL + CORRECTING OPTIMISTIC UPDATES */
    const params = Params.fetch()
    Api.put(Routes.dealCategoryTreeElementRestriction(params.deals, params.categories, treeElement.id, restriction.id), restriction)
      .then((restrictionsResponse) => {
        // find tree, tree element, and restriction
        const originalTree = _.cloneDeep(this.state.tree)
        const { tree, index } = this._findTreeElement(originalTree, treeElement)
        const restrictions = tree[index].tree_element_restrictions
        _.each(restrictionsResponse, restrictionResponse => {
          const restrictionIndex = _.findIndex(restrictions, { restrictable_id: restrictionResponse.restrictable_id, restrictable_type: restrictionResponse.restrictable_type })

          // replace the temporary restriction with the real one
          restrictions.splice(restrictionIndex, 1, restrictionResponse)
        })

        // update state
        this._updateEditableState(originalTree, tree[index])
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  deleteRestriction(restriction, inheritedRestrictions, treeElement) {
    const prevState = _.cloneDeep(this.state)

    /* OPTIMISTIC UPDATING */
    // find tree, tree element, and restriction
    const originalTree = _.cloneDeep(this.state.tree)
    const { tree, index } = this._findTreeElement(originalTree, treeElement)
    const restrictions = tree[index].tree_element_restrictions

    // remove the restrictions
    _.each(_.concat(restriction, inheritedRestrictions), restriction => {
      _.remove(restrictions, { restrictable_id: restriction.restrictable_id, restrictable_type: restriction.restrictable_type })
    })
    tree[index].tree_element_restrictions = restrictions

    // update state
    this._updateEditableState(originalTree, tree[index])

    const params = Params.fetch()
    Api.delete(Routes.dealCategoryTreeElementRestriction(params.deals, params.categories, treeElement.id, restriction.id))
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  propagateRestrictionsToChildren(treeElement) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)
    const originalTree = _.cloneDeep(this.state.tree)
    const { tree, index } = this._findTreeElement(originalTree, treeElement)
    const treeElementRestrictions = tree[index].tree_element_restrictions

    const propagateToChildren = treeElement => {
      treeElement.tree_element_restrictions = _.cloneDeep(treeElementRestrictions)
      // set the id of the restriction to the child treeElement
      _.each(treeElement.tree_element_restrictions, tree_element_restriction => {
        tree_element_restriction.tree_element_id = treeElement.id
      })
      _.each(treeElement.children, child => {
        propagateToChildren(child)
      })
    }
    propagateToChildren(tree[index])

    this._updateEditableState(originalTree, null, { updateSelected: false })

    Api.get(Routes.dealCategoryTreeElementPropagateRestrictionsToDescendants(params.deals, params.categories, treeElement.id, ['attachment.latest_version.uploader.user','attachment.latest_version.uploader.entity', 'attachment.latest_version.version_storageable', 'completion_statuses', 'responsible_parties.deal_entity.entity', 'responsible_parties.deal_entity_user.entity_user.user', 'responsible_parties.deal_entity.deal_entity_users.entity_user.user', 'tree_element_restrictions']))
      .then(treeElements => {
        const treeElement = treeElements[0]
        const newTree = _.cloneDeep(this.state.tree)
        const { tree, index } = this._findTreeElement(newTree, treeElement)
        tree[index] = _.merge(tree[index], treeElement)
        this._updateEditableState(newTree, null, { updateSelected: false })
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  setActiveParty(treeElement, responsibleParty) {
    const params = Params.fetch()
    let originalResponsibleParties = _.cloneDeep(treeElement.responsible_parties)
    let pastActiveParty = _.find(treeElement.responsible_parties, ['is_active', true])
    _.assign(pastActiveParty, { is_active: false})
    const activePartyIndex = _.findIndex(originalResponsibleParties, { id: pastActiveParty.id })

    // update current active party to not active first
    Api.put(Routes.dealCategoryTreeElementResponsibleParty(params.deals, params.categories, treeElement.id, pastActiveParty.id, ['deal_entity.entity', 'deal_entity.deal_entity_users.entity_user.user', 'deal_entity_user.entity_user.user']), pastActiveParty)
      .then((pastActiveParty) => {
        originalResponsibleParties.splice(activePartyIndex, 1)
        originalResponsibleParties.push(pastActiveParty)
        const newActiveParty = _.assign({}, responsibleParty, { is_active: true, text: null})

        // set selected active party
        Api.put(Routes.dealCategoryTreeElementResponsibleParty(params.deals, params.categories, treeElement.id, responsibleParty.id, ['deal_entity.entity', 'deal_entity.deal_entity_users.entity_user.user', 'deal_entity_user.entity_user.user']), newActiveParty)
          .then((responsibleParty) => {
            const partyIndex = _.findIndex(originalResponsibleParties, { id: responsibleParty.id })
            originalResponsibleParties.splice(partyIndex, 1)
            originalResponsibleParties.push(responsibleParty)

            this.updateEditableTreeElement(_.assign({}, treeElement, { responsible_parties: originalResponsibleParties }))
          })
          .catch(error => { ErrorHandling.setErrors(error)}) // eslint-disable-line
      })
      .catch(error => { ErrorHandling.setErrors(error)}) // eslint-disable-line
  }

  getUnplacedUploads() {
    const params = Params.fetch()
    Api.get(Routes.dealVersions(params.deals, ['attachment','uploader.user','uploader.entity','version_storageable']))
      .then((unplacedUploads) => {
        this.setState({
          unplacedUploads: unplacedUploads
        })
      })

      .catch(() => ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'category.checklist.toolbar.unable_to_load_uploads'})]}})) // eslint-disable-line
  }

  getPlacedUploads(callback) {
    const params = Params.fetch()
    Api.get(Routes.dealCategoryVersions(params.deals, params.categories, ['attachment.attachable','uploader.user','uploader.entity','version_storageable']))
      .then((placedUploads) => {
        this.setState({
          placedUploads: placedUploads
        }, callback)
      })
      .catch(() => ErrorHandling.setErrors({messages: {errors: [this.props.intl.formatMessage({id: 'category.checklist.toolbar.unable_to_load_uploads'})]}})) // eslint-disable-line
  }

  placeUpload(treeElement, version, errorCallback = null) {
    const params = Params.fetch()
    const prevState = this.state
    if (treeElement.type === 'Section') {
      App.FlashMessages.addMessage('error', this.props.intl.formatMessage({id: 'category.sidebar.uploads.errors.cannot_drop_there'}))
      errorCallback()
      return
    } else if (!treeElement.id) {
      // need to make a new treeElement
      treeElement.attachment_id = version.attachment_id

      // find the shared parent
      const originalTree = this.state.tree
      let tree = originalTree
      let ancestry = treeElement.ancestry.split('/')

      // Change type to section if category is closing and dropping at first level on checklist.
      if (ancestry.length === 1 && this.state.categoryType === "ClosingCategory") {
        treeElement.type = "Section"
      }
      ancestry.splice(0, 1)
      ancestry.forEach(function(id) {
        tree = _.find(tree, { id: parseInt(id) }).children
      })

      // insert the new tree element
      tree.splice(treeElement.position-1, 0, treeElement)

      // update all the tree elements after it
      for(var i = treeElement.position; i < tree.length; i++) {
        tree[i].position += 1
      }

      const params = Params.fetch()
      Api.post(Routes.dealCategoryTreeElements(params.deals, params.categories, ['attachment.latest_version.uploader.user','attachment.latest_version.version_storageable','attachment.latest_version.uploader.entity', 'completion_statuses', 'tree_element_restrictions']), treeElement)
        .then((treeElementResponse) => {
          // TODO: temporary solution until we can fix the backend to either not return the children or expand them properly
          treeElementResponse.children = []

          // find the correct location in the tree
          const originalTree = _.cloneDeep(this.state.tree)
          let { tree, index } = this._findTreeElement(originalTree, treeElement)

          // insert the new tree element where the editable one was
          tree.splice(index, 1, treeElementResponse)

          if (this.state.categoryType === 'DiligenceCategory' && treeElementResponse.type === 'Document') {
            this._updateAllReviewedCounts(treeElementResponse, {documents: 1}, originalTree)
            this._updateAllReviewedCounts(treeElementResponse, {with_attachment: 1}, originalTree)
          }

          this._updateEditableState(originalTree, treeElementResponse)

          // update uploads
          let newVersion = _.cloneDeep(treeElementResponse.attachment.latest_version)
          newVersion.attachment = _.cloneDeep(treeElementResponse.attachment)
          newVersion.attachment.attachable = _.cloneDeep(treeElementResponse)

          let placedUploads = _.cloneDeep(this.state.placedUploads)
          placedUploads.push(newVersion)

          let unplacedUploads = _.cloneDeep(this.state.unplacedUploads)
          _.remove(unplacedUploads, { id: newVersion.id })

          this.setState({
            unplacedUploads: unplacedUploads,
            placedUploads: placedUploads
          })
        })
        .catch(error => {ErrorHandling.setErrors(error, () => this.setState(prevState, errorCallback))}) // eslint-disable-line
    } else if (treeElement.attachment) {
      let newVersion = _.clone(version)
      newVersion.attachment = null
      newVersion.attachment_id = treeElement.attachment.id
      newVersion.position = treeElement.attachment.latest_version.position + 1

      Api.put(Routes.moveUnplacedVersion(params.deals, newVersion.id, ['attachment.attachable.completion_statuses', 'uploader.user', 'uploader.entity', 'version_storageable']), newVersion)
        .then((versionResponse) => {
          // TODO: temporary solution until we can fix the backend to either not return the children or expand them properly
          versionResponse.attachment.attachable.children = []

          let unplacedUploads = _.cloneDeep(this.state.unplacedUploads)
          _.remove(unplacedUploads, { id: newVersion.id })

          let placedUploads = _.cloneDeep(this.state.placedUploads)
          placedUploads.push(versionResponse)

          this.setState({
            unplacedUploads: unplacedUploads,
            placedUploads: placedUploads
          })

          let newTreeElement = _.merge({}, _.cloneDeep(treeElement), _.cloneDeep(versionResponse.attachment.attachable))
          // make sure to update the completion_statuses
          newTreeElement.completion_statuses = versionResponse.attachment.attachable.completion_statuses
          newTreeElement.attachment.latest_version = _.cloneDeep(versionResponse)

          // find the correct location in the tree
          const originalTree = _.cloneDeep(this.state.tree)
          let { tree, index } = this._findTreeElement(originalTree, newTreeElement)
          newTreeElement.attachment.attachable = null
          newTreeElement.attachment.latest_version.attachment = null

          // insert the new tree element where the editable one was
          tree.splice(index, 1, newTreeElement)

          this._updateEditableState(originalTree, newTreeElement)
        })
        .catch(error => {ErrorHandling.setErrors(error, () => this.setState(prevState, errorCallback))}) // eslint-disable-line
    } else {
      const attachment = _.cloneDeep(version.attachment)
      attachment.attachable_id = treeElement.id
      attachment.attachable_type = 'TreeElement'
      Api.put(Routes.moveUnplacedAttachment(params.deals, attachment.id, ['attachable.completion_statuses', 'latest_version.uploader.user', 'latest_version.uploader.entity', 'latest_version.version_storageable']), attachment)
        .then((attachmentResponse) => {
          let newVersion = attachmentResponse.latest_version
          newVersion.attachment = attachmentResponse
          // TODO: temporary solution until we can fix the backend to either not return the children or expand them properly
          newVersion.attachment.attachable.children = []

          let unplacedUploads = _.cloneDeep(this.state.unplacedUploads)
          _.remove(unplacedUploads, { id: version.id })

          let placedUploads = _.cloneDeep(this.state.placedUploads)
          placedUploads.push(newVersion)

          this.setState({
            unplacedUploads: unplacedUploads,
            placedUploads: placedUploads
          })

          let newTreeElement = _.cloneDeep(treeElement)
          newTreeElement.attachment = _.cloneDeep(attachmentResponse)
          // update with new completion_statuses
          newTreeElement.completion_statuses = attachmentResponse.attachable.completion_statuses
          newTreeElement.attachment.attachable = null
          newTreeElement.attachment.latest_version.attachment = null

          // find the correct location in the tree
          const originalTree = _.cloneDeep(this.state.tree)
          let { tree, index } = this._findTreeElement(originalTree, newTreeElement)

          // insert the new tree element where the editable one was
          tree.splice(index, 1, newTreeElement)

          if (this.state.categoryType === 'DiligenceCategory' && newTreeElement.type === 'Document') {
            this._updateAllReviewedCounts(newTreeElement, {with_attachment: 1}, originalTree)
          }

          this._updateEditableState(originalTree, newTreeElement)
        })
        .catch(error => {ErrorHandling.setErrors(error, () => this.setState(prevState, errorCallback))})
    }
  }

  moveTreeElement(dragging, parent, after) {
    const isParentOfAfter = after && _.includes(after.ancestry, dragging.id)
    const isParentOfParent = parent && _.includes(parent.ancestry, dragging.id)
    const isAfter = after && after.id === dragging.id
    const isParent = parent && parent.id === dragging.id
    if (isAfter || isParent || isParentOfAfter || isParentOfParent) {
      App.FlashMessages.addMessage('error', this.props.intl.formatMessage({id: 'category.checklist.dnd.cannot_drop'})) // eslint-disable-line
      return
    }

    const prevState = _.cloneDeep(this.state)

    /* STEP 1: remove from its existing position */
    // find the shared parent array
    const originalTree = _.cloneDeep(this.state.tree)

    let newDragging = this._findTreeElement(originalTree, dragging)
    newDragging = newDragging.tree[newDragging.index]

    // remove completion numbers from old ancestry
    if (this.state.categoryType === 'DiligenceCategory') {
      this._removeTreeElementsFolderCompletionNumbersFromNode(newDragging, originalTree)
    }

    let tree = originalTree
    let ancestry = newDragging.ancestry.split('/')
    ancestry.splice(0, 1)
    ancestry.forEach(function(id) {
      tree = _.find(tree, { id: parseInt(id) }).children
    })

    // remove the dragging tree element from the array
    const currentIndex = newDragging.position-1
    tree.splice(currentIndex, 1)
    for(var i = currentIndex; i < tree.length; i++) {
      tree[i].position -= 1
    }

    /* STEP 2: find the tree it will be placed in */
    const params = Params.fetch()
    let newTree = originalTree
    let newAncestry = params.categories
    let newParent
    if (parent) {
      newParent = this._findTreeElement(originalTree, parent)
      newTree = newParent.tree[newParent.index].children
      newAncestry = `${parent.ancestry}/${parent.id}`
    }

    /* STEP 3: find where it should be placed in that tree */
    let newIndex = 0
    if (after) {
      const newAfter = this._findTreeElement(originalTree, after)
      newIndex = newAfter.index+1
    }

    /* STEP 4: insert the tree element in the correct spot */
    // update its position and its ancestry
    newDragging.position = newIndex+1
    newDragging.ancestry = newAncestry
    if (this.state.categoryType === 'ClosingCategory') {
      if (parent && dragging.type === 'Section') {
        newDragging.type = 'Document'
      } else {
        newDragging.type = parent ? dragging.type : 'Section'
      }
    }

    // add the folder completion numbers to the new parent
    if (this.state.categoryType === 'DiligenceCategory') {
      this._addTreeElementsFolderCompletionNumbersToNode(newDragging, originalTree)
    }

    // also update the ancestry of its children
    this._updateChildrenAncestry(newDragging)

    // update any ongoing uploads that are completed but haven't been placed yet
    let ongoingUploads = _.cloneDeep(this.state.ongoingUploads)
    const getChildIds = treeElement => {
      // returns an array of all the tree element ids of all the tree element under this tree element
      return [treeElement.id, ..._.flatten(treeElement.children.map(child => getChildIds(child)))]
    }

    const childIds = getChildIds(newDragging)
    const ongoingUploadsThatNeedToBeUpdated = _.filter(ongoingUploads, ongoingUpload => _.includes(childIds, ongoingUpload.parentTreeElementId) && ongoingUpload.tree_element_response)
    _.each(ongoingUploadsThatNeedToBeUpdated, ongoingUpload => {
      ongoingUpload.tree_element_response.ancestry = `${newDragging.ancestry}/${newDragging.id}`
    })
    this.setState({
      ongoingUploads: ongoingUploads
    })

    // insert into the correct spot
    newTree.splice(newIndex, 0, _.cloneDeep(newDragging))

    // update all tree elements after it
    for(i = newIndex+1; i < newTree.length; i++) {
      newTree[i].position += 1
    }

    const callback = () => this.updateTreeElement(newDragging, () => {
      // handle if the move failed
      this.setState(prevState)
    })

    this._updateEditableState(originalTree, newDragging, {callback: callback})
  }

  deleteUpload(version, errorCallback = null) {
    const params = Params.fetch()
    const prevState = this.state

    let unplacedUploads = _.cloneDeep(this.state.unplacedUploads)
    _.remove(unplacedUploads, { id: version.id })

    this.setState({
      unplacedUploads: unplacedUploads
    })

    Api.delete(Routes.dealVersion(params.deals, version.id))
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState, errorCallback))}) // eslint-disable-line
  }

  uploadVersion(treeElement, {file = null, callback = null, errorCallback = null, dmsObject = {}} = {}) {
    // TODO: Move this code to the API helper
    let formData = new FormData()
    if (file) {
      formData.append('file', file)
    } else if (dmsObject) {
      formData.append('dms_object', JSON.stringify(dmsObject))
    }


    const afterSend = (newTreeElement, incrementor) => {
      // TODO: temporary solution until we can fix the backend to either not return the children or expand them properly
      newTreeElement.children = []

      // find the correct location in the tree
      const originalTree = _.cloneDeep(this.state.tree)
      let { tree, index } = this._findTreeElement(originalTree, newTreeElement)

      // save completion_statuses from tree_element response to a variable
      const completionStatuses = newTreeElement.completion_statuses

      newTreeElement = _.merge({}, tree[index], newTreeElement)

      // reset the newly merged newTreeElement to be the completion statuses from the API response.
      newTreeElement.completion_statuses = completionStatuses

      // insert the updated tree element where the old one was
      tree.splice(index, 1, newTreeElement)

      if (this.state.categoryType === 'DiligenceCategory' && newTreeElement.type === 'Document') {
        this._updateAllReviewedCounts(newTreeElement, incrementor, originalTree)
      }

      // update in placed versions
      let placedUploads = _.cloneDeep(this.state.placedUploads)
      let newVersion = _.cloneDeep(newTreeElement.attachment.latest_version)
      newVersion.attachment = _.cloneDeep(newTreeElement.attachment)
      newVersion.attachment.latest_version = null
      newVersion.attachment.attachable = _.cloneDeep(newTreeElement)
      newVersion.attachment.attachable.attachment = null
      placedUploads.push(newVersion)

      this.setState({
        placedUploads
      })

      this._updateEditableState(originalTree, newTreeElement)
    }

    // upload
    const url = this.createVersionUrl(treeElement, dmsObject)
    const authCookie = Cookies.getJSON('authentication')
    fetch(`${Api._baseUrl}${url}`, {
      method: 'POST',
      headers: new Headers({
        'X-User-Token': authCookie.token, // TODO: can do `data instanceof FormData` to move this to Api helper
        'X-User-Email': authCookie.email,
        'X-Entity-User-Id': authCookie.entity_user_id
      }),
      body: formData
    })
      .then(Api._parseJSON)
      .then(Api._checkStatus)
      .then(Api._getData)
      .then(response => {
        let newTreeElement = _.cloneDeep(treeElement)
        let incrementor = {}
        if (treeElement.attachment) {
          newTreeElement.attachment.latest_version = response
          newTreeElement.completion_statuses = response.attachment.attachable.completion_statuses
        } else {
          newTreeElement.attachment = response
          incrementor.with_attachment = 1
        }

        // update completion numbers
        const wasComplete = _.filter(treeElement.completion_statuses, { is_complete: true }).length > 0
        const isComplete = _.filter(newTreeElement.completion_statuses, { is_complete: true }).length > 0
        if (wasComplete) {
          incrementor.completed = -1
        } else if (!wasComplete && isComplete) {
          incrementor.completed = 1
        }
        afterSend(newTreeElement, incrementor)
        if (callback) {
          callback()
        }
      })
      .catch(error => {
        if (errorCallback){
          ErrorHandling.setErrors(error, errorCallback) // eslint-disable-line
        } else {
          ErrorHandling.setErrors(error)
        }
      })
  }

  createVersionUrl(treeElement, dmsObject) {
    const params = Params.fetch()
    const dmsVersion = !_.isEmpty(dmsObject)
    if (treeElement.attachment) {
      // check to see if the dmsObject is present
      if (dmsVersion) {
        switch(this.state.dmsType) {
          case DMS_TYPES.net_documents:
            return Routes.dealCategoryTreeElementNetDocumentsAttachmentVersions(params.deals, params.categories, treeElement.id, treeElement.attachment.id, ['uploader.user','uploader.entity','attachment.attachable.completion_statuses', 'version_storageable'])
          case DMS_TYPES.see_unity_imanage:
            return Routes.dealCategoryTreeElementSeeUnityImanageAttachmentVersions(params.deals, params.categories, treeElement.id, treeElement.attachment.id, ['uploader.user','uploader.entity','attachment.attachable.completion_statuses', 'version_storageable'])
          case DMS_TYPES.imanage10:
            return Routes.dealCategoryTreeElementImanage10AttachmentVersions(params.deals, params.categories, treeElement.id, treeElement.attachment.id, ['uploader.user','uploader.entity','attachment.attachable.completion_statuses', 'version_storageable'])
        }
      } else {
        return Routes.dealCategoryTreeElementAttachmentVersions(params.deals, params.categories, treeElement.id, treeElement.attachment.id, ['uploader.user','uploader.entity','attachment.attachable.completion_statuses', 'version_storageable'])
      }
    } else {
      if (dmsVersion) {
        switch(this.state.dmsType) {
          case DMS_TYPES.net_documents:
            return Routes.dealCategoryTreeElementNetDocumentsAttachments(params.deals, params.categories, treeElement.id, ['latest_version.uploader.user', 'latest_version.uploader.entity', 'latest_version.version_storageable'])
          case DMS_TYPES.see_unity_imanage:
            return Routes.dealCategoryTreeElementSeeUnityImanageAttachments(params.deals, params.categories, treeElement.id, ['latest_version.uploader.user', 'latest_version.uploader.entity', 'latest_version.version_storageable'])
          case DMS_TYPES.imanage10:
            return Routes.dealCategoryTreeElementImanage10Attachments(params.deals, params.categories, treeElement.id, ['latest_version.uploader.user', 'latest_version.uploader.entity', 'latest_version.version_storageable'])
        }
      } else {
        return Routes.dealCategoryTreeElementAttachments(params.deals, params.categories, treeElement.id, ['latest_version.uploader.user', 'latest_version.uploader.entity', 'latest_version.version_storageable'])
      }
    }
  }

  /* Update Item */
  updateTreeElement(treeElement, errorCallback = null) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)
    Api.put(Routes.dealCategoryTreeElement(params.deals, params.categories, treeElement.id, ['attachment.latest_version.uploader.user', 'attachment.latest_version.uploader.entity', 'attachment.latest_version.version_storageable', 'completion_statuses', 'responsible_parties.deal_entity.entity', 'responsible_parties.deal_entity_user.entity_user.user', 'responsible_parties.deal_entity.deal_entity_users.entity_user.user']), treeElement)
      .then((treeElementResponse) => {
        // TODO: temporary solution until we can fix the backend to either not return the children or expand them properly
        treeElementResponse.children = []

        // find the correct location in the tree
        const originalTree = _.cloneDeep(this.state.tree)
        let { tree, index } = this._findTreeElement(originalTree, treeElementResponse)

        // merge with old tree element
        const newTreeElement = _.merge({}, tree[index], treeElementResponse)
        // because merge keeps completion_statuses when we don't want it to.
        newTreeElement.completion_statuses = treeElementResponse.completion_statuses

        // insert the updated tree element where the old one was
        tree.splice(index, 1, newTreeElement)

        // updated placed uploads
        if (newTreeElement.attachment) {
          let placedUploads = _.cloneDeep(this.state.placedUploads)
          let upload = _.find(placedUploads, { id: newTreeElement.attachment.latest_version.id })
          _.merge(upload, newTreeElement.attachment.latest_version)
          if (upload) {
            // update attachable with the new tree element
            upload.attachment = _.cloneDeep(newTreeElement.attachment)
            upload.attachment.latest_version = null
            upload.attachment.attachable = _.cloneDeep(newTreeElement)
            upload.attachment.attachable.attachment = null

            this.setState({
              placedUploads
            })
          }
        }

        this._updateEditableState(originalTree, newTreeElement)
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState, errorCallback))}) // eslint-disable-line
  }

  /* Update Item */
  updateVersion(treeElement, version, errorCallback = null) {
    // find the correct location in the tree
    const originalTree = _.cloneDeep(this.state.tree)
    const params = Params.fetch()
    Api.put(Routes.dealCategoryTreeElementAttachmentVersion(params.deals, params.categories, treeElement.id, treeElement.attachment.id, treeElement.attachment.latest_version.id, ['uploader.entity', 'uploader.user', 'version_storageable']), version)
      .then((versionResponse) => {
        let { tree, index } = this._findTreeElement(originalTree, treeElement)

        // update tree element
        const newTreeElement = _.cloneDeep(treeElement)
        newTreeElement.attachment.latest_version = versionResponse

        // insert the updated tree element where the old one was
        tree.splice(index, 1, newTreeElement)
        this._updateEditableState(originalTree, newTreeElement)

        // update in placed versions
        let placedUploads = _.cloneDeep(this.state.placedUploads)
        let oldVersion = _.find(placedUploads, { id: version.id })
        _.merge(oldVersion, version)
        this.setState({ placedUploads })
      })
      .catch(error => { ErrorHandling.setErrors(error) }) // eslint-disable-line
  }

  deleteTreeElement(treeElement) {
    const params = Params.fetch()
    Api.delete(Routes.dealCategoryTreeElement(params.deals, params.categories, treeElement.id))
      .then(() => {
        // find the correct location in the tree
        const originalTree = _.cloneDeep(this.state.tree)

        // update folder completion numbers on data Room
        if (this.state.categoryType === "DiligenceCategory"){
          this._removeTreeElementsFolderCompletionNumbersFromNode(treeElement, originalTree)
        }

        // remove from checklist
        let { tree, index } = this._findTreeElement(originalTree, treeElement)
        tree.splice(index, 1)
        // update positions
        for(var i = index; i < tree.length; i++) {
          tree[i].position -= 1
        }

        // find new selected tree element
        const deletedTreeElementAncestry = treeElement.ancestry.split('/')
        let newSelectedTreeElement = null

        if (tree.length > index) {
          newSelectedTreeElement = tree[index]
        } else if (deletedTreeElementAncestry.length > 1) {
          const parent = deletedTreeElementAncestry[deletedTreeElementAncestry.length - 1]
          let result = this._findTreeElement(originalTree, {id: parseInt(parent), ancestry: _.dropRight(deletedTreeElementAncestry).join('/')})
          if (result.tree.length > result.index + 2) {
            newSelectedTreeElement = result.tree[result.index + 1]
          } else {
            newSelectedTreeElement = result.tree[result.index]
          }
        }

        const getChildren = function(treeElement) {
          // returns an array of all the tree elements of all the tree elements under this tree element
          return [treeElement, ..._.flatten(treeElement.children.map(child => getChildren(child)))]
        }
        const flattenedChildren = getChildren(treeElement)

        let placedUploads = _.cloneDeep(this.state.placedUploads)
        let ongoingUploads = _.cloneDeep(this.state.ongoingUploads)
        _.each(flattenedChildren, child => {
          // remove versions from placed uploads
          if (child.attachment) {
            _.remove(placedUploads, { attachment_id: child.attachment.id })
          }

          // remove any ongoing uploads
          _.remove(ongoingUploads, { parentTreeElementId: child.id })
        })

        // update any completed ongoing uploads that have the same parent
        _.each(_.filter(ongoingUploads, { parentTreeElementId: parseInt(_.last(deletedTreeElementAncestry)), complete: true }), ongoingUpload => {
          if (ongoingUpload.tree_element_response) {
            ongoingUpload.tree_element_response.position -= 1
          }
        })

        this.setState({
          ongoingUploads,
          placedUploads
        })

        this._updateEditableState(originalTree, newSelectedTreeElement)
      })
      .catch(error => { ErrorHandling.setErrors(error) }) // eslint-disable-line
  }

  /* Searching and filtering */
  /* TODO: It may be advantageous to move this filter code (especially the mapping of filters) to its own file,
     but as of right now I'm not sure what that will look like */
  filterTree(tree = [], query = '', filter) {
    let filteredTree = []
    const matchesQuery = (treeElement) => (treeElement.name.toLowerCase().includes(query.trim().toLowerCase()))
    const matchesParties = (treeElement, thisFilter) => {
      if (thisFilter === 'show_all_parties') {
        return true
      }
      return _.some(treeElement.responsible_parties, { is_active: true, deal_entity: { id: thisFilter } })
    }
    // TODO: Category type specific code shouldn't be in this file
    const matchesDocuments = (treeElement, thisFilter) => {
      switch(thisFilter) {
        case 'show_all_documents':
          return true
        case 'task':
          return treeElement.type === 'Task'
        case 'not_started':
          return treeElement.type === 'Document' && !treeElement.attachment
        default:
          return treeElement.type !== 'Task' && treeElement.attachment && treeElement.attachment.latest_version && treeElement.attachment.latest_version.status === thisFilter
      }
    }
    const matchesFilters = (treeElement, thisFilter) => {
      switch(thisFilter) {
        case 'show_all':
          return true
        case 'reviewed':
          return treeElement.completion_statuses.length && treeElement.completion_statuses[0].is_complete
        case 'needs_review':
          return treeElement.attachment && (treeElement.completion_statuses.length === 0 || !treeElement.completion_statuses[0].is_complete)
        case 'file_not_uploaded':
          return !treeElement.attachment && treeElement.type === 'Document'
        default:
          return true
      }
    }
    const matchesAllTypes = treeElement => (
      _.every(filter, (value, key) => {
        switch(key) {
          case 'parties':
            return _.some(value, v => matchesParties(treeElement, v))
          case 'documents':
            return _.some(value, v => matchesDocuments(treeElement, v))
          default:
            return _.some(value, v => matchesFilters(treeElement, v))
        }
      })
    )
    _.each(tree, treeElement => {
      treeElement.children = this.filterTree(treeElement.children, query, filter)
      if (treeElement.children.length > 0 || (matchesQuery(treeElement) && matchesAllTypes(treeElement))) {
        filteredTree.push(treeElement)
      }
    })
    return filteredTree
  }

  search(query) {
    this.setState({
      searchQuery: query,
      filteredTree: this.filterTree(_.cloneDeep(this.state.tree), query, this.state.filter)
    })
  }

  setFilter(filter) {
    this.setState({
      filter: filter,
      filteredTree: this.filterTree(_.cloneDeep(this.state.tree), this.state.searchQuery, filter)
    })
  }

  /* Selecting */
  selectTreeElement(treeElement, callback = null) {
    this.setState({
      selectedTreeElement: treeElement,
      showUploads: false
    }, callback)
  }

  toggleUploads() {
    this.setState({ showUploads: !this.state.showUploads })
  }

  setDragging(dragging) {
    this.setState({ draggingUpload: dragging })
  }

  /* Add Item */
  addTreeElement(treeElement, insertAnother = false, errorCallback = null) {
    const params = Params.fetch()
    const prevState = _.cloneDeep(this.state)
    Api.post(Routes.dealCategoryTreeElements(params.deals, params.categories, ['attachment.latest_version.uploader.user','attachment.latest_version.uploader.entity', 'attachment.latest_version.version_storageable', 'completion_statuses', 'responsible_parties.deal_entity.entity', 'responsible_parties.deal_entity_user.entity_user.user', 'responsible_parties.deal_entity.deal_entity_users.entity_user.user', 'tree_element_restrictions']), treeElement)
      .then((treeElementResponse) => {
        // find the correct location in the tree
        const originalTree = _.cloneDeep(this.state.tree)
        let { tree, index } = this._findTreeElement(originalTree, treeElement)

        // insert the new tree element where the editable one was
        tree.splice(index, 1, treeElementResponse)
        if (this.state.categoryType === 'DiligenceCategory') {
          if (treeElementResponse.type === 'Folder') {
            treeElementResponse.folder_completion_numbers = {
              completed_documents_count: 0,
              descendant_documents_count: 0,
              documents_with_attachment_count: 0
            }
          }
          else {
            treeElementResponse.folder_completion_numbers = {}
            // will actually insert the new tree_element. so everything needs to be in order before here if a diligence document
            this._updateAllReviewedCounts(treeElementResponse, {documents: 1}, originalTree)
          }
        }

        this._updateEditableState(
          originalTree,
          treeElementResponse,
          {
            callback: insertAnother ? this.insertEditableTreeElement : null,
            updateSelected: insertAnother
          }
        )
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState, errorCallback))}) // eslint-disable-line
  }

  insertEditableTreeElement(itemType = null) {
    // TODO: Make tree elements created by dragging an upload go into this editable state
    // only edit one thing at a time
    const { selectedTreeElement, editableTreeElement } = this.state
    if (editableTreeElement) {
      $('#editableTreeElementInput').focus() // this is nasty, but Isaiah and Moses insisted upon it. Edit: Thankfully, Ben saw the light and complied.
      return
    }

    // find the correct location in the tree
    const originalTree = _.cloneDeep(this.state.tree)
    let tree = originalTree
    let index = -1
    if (selectedTreeElement) {
      const result = this._findTreeElement(originalTree, selectedTreeElement)
      tree = result.tree
      index = result.index
    }

    // add the new tree element
    let type
    if (itemType) {
      type = itemType
    } else if (selectedTreeElement) {
      type = selectedTreeElement.type
    } else {
      type = 'Section'
    }

    let ancestry
    if (selectedTreeElement && selectedTreeElement.type === 'Folder') {
      ancestry = selectedTreeElement.ancestry + '/' + selectedTreeElement.id

      tree = tree[index].children
      index = -1
    } else if (selectedTreeElement) {
      ancestry = selectedTreeElement.ancestry
    } else {
      ancestry = Params.fetch().categories
    }
    const newTreeElement = {
      id: null,
      name: '',
      type: type,
      position: index+2,
      ancestry: ancestry,
      completion_statuses: [],
      tree_element_restrictions: []
    }
    tree.splice(index+1, 0, newTreeElement)
    // update all the tree elements after it
    for(var i = index+2; i < tree.length; i++) { // doing a regular for loop here so that we only have to iterate over the tree elements after the new one
      tree[i].position += 1
    }

    this._updateEditableState(originalTree, newTreeElement, {editable: true, clearFilter: true})
  }

  updateEditableTreeElement(treeElement, callback = null, updateSelected = true) {
    // find the correct location in the tree
    const originalTree = _.cloneDeep(this.state.tree)
    let { tree, index } = this._findTreeElement(originalTree, treeElement)

    // update the editable tree element
    tree.splice(index, 1, treeElement)

    this._updateEditableState(originalTree, treeElement, {editable: true, callback: callback, updateSelected: updateSelected})
  }

  removeEditableTreeElement(callback = null) {
    // find the correct location in the tree
    const originalTree = _.cloneDeep(this.state.tree)
    const selectedTreeElement = this.state.selectedTreeElement

    let { tree, index } = this._findTreeElement(originalTree, selectedTreeElement)
    let newSelectedTreeElement = tree[index > 0 ? index-1 : 0]

    // remove the editable tree element
    tree.splice(index, 1)
    for(var i = index; i < tree.length; i++) { // doing a regular for loop here so that we only have to iterate over the tree elements after the new one
      tree[i].position -= 1
    }

    // For the DataRoom, the editable TreeElement will always be the first item INSIDE a folder.
    // Thus, in that case the newSelectedTreeElement will always be null, and the sidebar will disappear moving the add item dropdown button.
    // The code below selects parent folder of the editable treeElement in that case.
    if ((selectedTreeElement.type === "Document" || selectedTreeElement.type === "Folder") && newSelectedTreeElement.id === null) {
      const originalAncestry = selectedTreeElement.ancestry.split('/')
      const parentId = parseInt(originalAncestry.splice(-1, 1)[0])
      // find the parent of the editable TreeElement
      const foundTreeElement = this._findTreeElement(originalTree, {id: parentId, ancestry: originalAncestry.join('/')} )
      const newTree = foundTreeElement.tree
      const newIndex = foundTreeElement.index
      // set the newSelectedTreeElement to be the parent
      newSelectedTreeElement = newTree[newIndex]
    }

    this._updateEditableState(originalTree, newSelectedTreeElement, {callback: callback})
  }

  _findTreeElement(originalTree, treeElement) {
    let tree = originalTree
    let ancestry = treeElement.ancestry.split('/')
    ancestry.splice(0, 1)
    try {
      ancestry.forEach(function(id) {
        tree = _.find(tree, { id: parseInt(id) }).children
      })
    } catch (e) {
      return {
        tree: tree,
        index: -1
      }
    }

    const index = _.findIndex(tree, { id: treeElement.id })

    return {
      tree: tree,
      index: index
    }
  }

  _updateEditableState(originalTree, newTreeElement, {editable = false, callback = null, updateSelected = true, clearFilter = false} = {}) {
    // filter the new tree
    const resetFilter = this.state.categoryType === 'DiligenceCategory' ? {filters:['show_all_documents']} : {parties:['show_all_parties'], documents:['show_all_documents']}
    const newSearchQuery = clearFilter ? '' : _.cloneDeep(this.state.searchQuery)
    const newFilter = clearFilter ? resetFilter : _.cloneDeep(this.state.filter)
    const newFilteredTree = this.filterTree(_.cloneDeep(originalTree), newSearchQuery, newFilter)
    // find the tree element again in the new tree
    if (newTreeElement) {
      let { tree, index } = this._findTreeElement(newFilteredTree, newTreeElement)
      let selectedTreeElement = updateSelected ? tree[index] : this.state.selectedTreeElement
      this.setState({
        filter: newFilter,
        searchQuery: newSearchQuery,
        tree: originalTree,
        editableTreeElement: editable ? tree[index] : null,
        selectedTreeElement: selectedTreeElement,
        filteredTree: newFilteredTree,
      }, callback)
    } else {
      let result = null
      if (this.state.selectedTreeElement) {
        const treeElementResult = this._findTreeElement(newFilteredTree, this.state.selectedTreeElement)
        result = treeElementResult.tree[treeElementResult.index]
      }
      let selectedTreeElement = updateSelected ? null : result
      this.setState({
        filter: newFilter,
        searchQuery: newSearchQuery,
        tree: originalTree,
        editableTreeElement: null,
        selectedTreeElement: selectedTreeElement,
        filteredTree: newFilteredTree
      }, callback)
    }
  }

  _updateChildrenAncestry(treeElement) {
    if (!treeElement.children) {
      return treeElement
    }

    _(treeElement.children).each((child) => {
      child.ancestry = `${treeElement.ancestry}/${treeElement.id}`
      this._updateChildrenAncestry(child)
    })

    return treeElement
  }

  createOrUpdateCompletionStatus(treeElement, completionStatus){
    let newTreeElement = treeElement
    const params = Params.fetch()
    const callback = completionStatus => {
      newTreeElement.completion_statuses = [completionStatus]
      const originalTree = _.cloneDeep(this.state.tree)
      let { tree, index } = this._findTreeElement(originalTree, newTreeElement)
      // insert the updated tree element where the old one was
      tree.splice(index, 1, newTreeElement)
      if (this.state.categoryType === 'DiligenceCategory') {
        let incrementor = {completed: completionStatus.is_complete ? 1 : -1}
        this._updateAllReviewedCounts(newTreeElement, incrementor, originalTree)
      }
      this._updateEditableState(originalTree, newTreeElement)
    }

    if (completionStatus.id) {
      Api.put(Routes.dealCategoryTreeElementCompletionStatus(params.deals, params.categories, treeElement.id, completionStatus.id), completionStatus)
        .then(completionStatus => callback(completionStatus))
        .catch(error => { ErrorHandling.setErrors(error) })
    } else {
      Api.post(Routes.dealCategoryTreeElementCompletionStatuses(params.deals, params.categories, treeElement.id), completionStatus)
        .then(completionStatus => callback(completionStatus))
        .catch(error => { ErrorHandling.setErrors(error) })
    }
  }

  _updateAllReviewedCounts(treeElement, incrementor, tree){
    let ancestryIds = treeElement.ancestry.split('/')
    // skip the category id
    ancestryIds.shift()
    if (ancestryIds.length > 0) {
      this._recursiveUpdateReviewedCounts(tree, incrementor, tree, ancestryIds)
    }
  }

  _recursiveUpdateReviewedCounts(rootTree, incrementor, newTree, ancestryIds) {
    let treeElement = _.find(newTree, {id: parseInt(ancestryIds[0])})

    let { tree, index } = this._findTreeElement(rootTree, treeElement)

    // choose which count to increment
    treeElement.folder_completion_numbers.completed_documents_count += incrementor.completed || 0
    treeElement.folder_completion_numbers.documents_with_attachment_count += incrementor.with_attachment || 0
    treeElement.folder_completion_numbers.descendant_documents_count += incrementor.documents || 0

    // insert the updated tree element where the old one was
    tree.splice(index, 1, treeElement)

    ancestryIds.shift()
    if (ancestryIds.length > 0) {
      this._recursiveUpdateReviewedCounts(rootTree, incrementor, treeElement.children, ancestryIds)
    }
  }

  _setCompletionNumbersForWholeChecklist(newTree){
    _.each(newTree, treeElement => {
      let { tree, index } = this._findTreeElement(newTree, treeElement)
      if (treeElement.type === "Folder") {
        this._getCompletionNumbersForWholeNode(tree[index], newTree)
      }
    })
    return newTree
  }

  _getCompletionNumbersForWholeNode(treeElement){
    let documentsCount = 0
    let withAttachmentCount = 0
    let completedCount = 0
    treeElement.folder_completion_numbers = {}
    if (treeElement.type === 'Document') {
      documentsCount += 1
      if (treeElement.attachment) {
        withAttachmentCount +=1
      }
      if (treeElement.completion_statuses.length && treeElement.completion_statuses[0].is_complete) {
        completedCount +=1
      }
    }
    else if (treeElement.type === 'Folder') {
      treeElement.children.map((child) => {
        let returnedCounts = this._getCompletionNumbersForWholeNode(child)
        documentsCount += returnedCounts.documentsCount
        withAttachmentCount += returnedCounts.withAttachmentCount
        completedCount += returnedCounts.completedCount
      })
      treeElement.folder_completion_numbers.descendant_documents_count = documentsCount
      treeElement.folder_completion_numbers.documents_with_attachment_count = withAttachmentCount
      treeElement.folder_completion_numbers.completed_documents_count = completedCount
    }
    return {documentsCount: documentsCount, withAttachmentCount: withAttachmentCount, completedCount: completedCount}
  }

  _removeTreeElementsFolderCompletionNumbersFromNode(treeElement, tree) {
    if (treeElement.type === "Document") {
      let incrementor = {
        documents: -1,
        with_attachment: treeElement.attachment ? -1 : 0,
        completed: treeElement.completion_statuses.length && treeElement.completion_statuses[0].is_complete ? -1 : 0
      }
      this._updateAllReviewedCounts(treeElement, incrementor, tree)
    } else {
      let incrementor = {
        documents: -treeElement.folder_completion_numbers.descendant_documents_count,
        with_attachment: -treeElement.folder_completion_numbers.documents_with_attachment_count,
        completed: -treeElement.folder_completion_numbers.completed_documents_count
      }
      this._updateAllReviewedCounts(treeElement, incrementor, tree)
    }
  }

  _addTreeElementsFolderCompletionNumbersToNode(treeElement, tree) {
    if (treeElement.type === "Document") {
      let incrementor = {
        documents: 1,
        with_attachment: treeElement.attachment ? 1 : 0,
        completed: treeElement.completion_statuses.length && treeElement.completion_statuses[0].is_complete ? 1 : 0
      }
      this._updateAllReviewedCounts(treeElement, incrementor, tree)
    } else {
      let incrementor = {
        documents: treeElement.folder_completion_numbers.descendant_documents_count,
        with_attachment: treeElement.folder_completion_numbers.documents_with_attachment_count,
        completed: treeElement.folder_completion_numbers.completed_documents_count
      }
      this._updateAllReviewedCounts(treeElement, incrementor, tree)
    }
  }

  // Upload Management
  initiateUploads(parentTreeElementId, files) {
    const newOngoingUploads = files.map(file => ({
      id: _.uniqueId(),
      parentTreeElementId,
      file,
      complete: false,
      in_progress: false,
      canceled: false,
      error: false,
      tree_element_response: null
    }))
    this.setState({
      ongoingUploads: _.concat(this.state.ongoingUploads, newOngoingUploads),
      showUploads: true
    }, this.performUpload)
  }

  performUpload() {
    let ongoingUploads = _.cloneDeep(this.state.ongoingUploads)

    // make sure there isn't a file currently uploading
    if (_.find(ongoingUploads, { in_progress: true })) {
      return
    }

    // find the file that should be uploaded next
    let upload = _.find(ongoingUploads, { complete: false, error: false, canceled: false, in_progress: false })
    if (upload === undefined) {
      // return if there are no uploads waiting
      return
    }
    upload.in_progress = true
    this.setState({ ongoingUploads })

    // prepare form data
    let formData = new FormData()
    formData.append('parent_tree_element_id', upload.parentTreeElementId)
    formData.append('file', upload.file)

    // upload
    const params = Params.fetch()
    const url = Routes.dealCategoryTreeElementsCreateFromUpload(params.deals, params.categories, ['attachment.latest_version.uploader.user','attachment.latest_version.uploader.entity', 'completion_statuses', 'tree_element_restrictions', 'responsible_parties'])
    const authCookie = Cookies.getJSON('authentication')
    fetch(`${Api._baseUrl}${url}`, {
      method: 'POST',
      headers: new Headers({
        'X-User-Token': authCookie.token, // TODO: can do `data instanceof FormData` to move this to Api helper
        'X-User-Email': authCookie.email,
        'X-Entity-User-Id': authCookie.entity_user_id
      }),
      body: formData
    })
    .then(Api._parseJSON)
    .then(Api._checkStatus)
    .then(Api._getData)
    .then(response => {
      ongoingUploads = _.cloneDeep(this.state.ongoingUploads)
      upload = _.find(ongoingUploads, { id: upload.id })
      upload.in_progress = false
      upload.complete = true
      upload.tree_element_response = response
      this.setState({ ongoingUploads }, () => {
        this.performUpload()
      })
    })
    .catch(error => {
      ongoingUploads = _.cloneDeep(this.state.ongoingUploads)
      upload = _.find(ongoingUploads, { id: upload.id })
      upload.in_progress = false
      upload.error = true
      this.setState({ ongoingUploads }, () => {
        this.performUpload()
      })
    })
  }

  moveCompletedUploads() {
    let ongoingUploads = _.cloneDeep(this.state.ongoingUploads)
    let completedUploads = _.remove(ongoingUploads, { complete: true })
    let placedUploads = _.cloneDeep(this.state.placedUploads)
    if (completedUploads.length > 0) {
      const originalTree = _.cloneDeep(this.state.tree)
      _.each(_.groupBy(completedUploads, 'parentTreeElementId'), (groupedUploads, parentTreeElementId) => {
        // get the parent tree element
        let { tree, index } = this._findTreeElement(originalTree, { id: parseInt(parentTreeElementId), ancestry: _.join(_.dropRight(_.first(groupedUploads).tree_element_response.ancestry.split('/')), '/') })

        // update the completion numbers
        if (this.state.categoryType === 'DiligenceCategory') {
          this._recursiveUpdateReviewedCounts(originalTree, {documents: groupedUploads.length, with_attachment: groupedUploads.length}, originalTree, _.tail(_.first(groupedUploads).tree_element_response.ancestry.split('/')))
        }

        // add the new tree elements to the tree
        _.each(groupedUploads, ongoingUpload => {
          // add to tree
          tree[index].children.push(ongoingUpload.tree_element_response)

          // add to placed uploads
          let latestVersion = _.cloneDeep(ongoingUpload.tree_element_response.attachment.latest_version)
          latestVersion.attachment = _.cloneDeep(ongoingUpload.tree_element_response.attachment)
          latestVersion.attachment.latest_version = null
          latestVersion.attachment.attachable = _.cloneDeep(ongoingUpload.tree_element_response)
          latestVersion.attachment.attachable.attachment = null
          placedUploads.push(latestVersion)
        })
      })

      // update state
      this.setState({
        ongoingUploads,
        placedUploads
      })
      this._updateEditableState(originalTree, null, {updateSelected: false})
    }
  }

  cancelOngoingUpload(ongoingUpload) {
    let newOngoingUploads = _.cloneDeep(this.state.ongoingUploads)
    let newOngoingUpload = _.find(newOngoingUploads, ongoingUpload)
    newOngoingUpload.canceled = true
    this.setState({
      ongoingUploads: newOngoingUploads
    })
  }

  cancelAllOngoingUploads() {
    let newOngoingUploads = _.cloneDeep(this.state.ongoingUploads)
    newOngoingUploads.map(ongoingUpload => {
      if (!ongoingUpload.complete && !ongoingUpload.in_progress) {
        ongoingUpload.canceled = true
      }
    })
    this.setState({
      ongoingUploads: newOngoingUploads
    })
  }

  clearAllOngoingUploads() {
    const newOngoingUploads = _.filter(this.state.ongoingUploads, { canceled: false, error: false })
    this.setState({
      ongoingUploads: newOngoingUploads
    })
  }

  getDmsType(dmsDealStorageDetailableType) {
    switch(dmsDealStorageDetailableType) {
      case 'NetDocumentsDealStorageDetails':
        return DMS_TYPES.net_documents
      case 'SeeUnityImanageDealStorageDetails':
        return DMS_TYPES.see_unity_imanage
      case 'Imanage10DealStorageDetails':
        return DMS_TYPES.imanage10
      default:
        return null
    }
  }

  addResponsibleParty(entityId, treeElement) {
    const params = Params.fetch()
    let newTreeElement = _.cloneDeep(treeElement)
    const originalTree = _.cloneDeep(this.state.tree)
    let { tree, index } = this._findTreeElement(originalTree, newTreeElement)
    tree.splice(index, 1, newTreeElement)

    const responsibleParty = {
      deal_entity_id: entityId,
      is_active: treeElement.responsible_parties.length === 0
    }
    this.setState({ isLoading: true })
    Api.post(Routes.dealCategoryTreeElementResponsibleParties(params.deals, params.categories, treeElement.id, ['deal_entity.entity', 'deal_entity.deal_entity_users.entity_user.user', 'deal_entity_user.entity_user.user']), responsibleParty)
      .then((responsibleParty) => {
        newTreeElement.responsible_parties.push(responsibleParty)
        this._updateEditableState(originalTree, newTreeElement)
        this.setState({ isLoading: false })
      })
      .catch(error => { ErrorHandling.setErrors(error) })
  }

  updateResponsibleParty(responsibleParty, treeElement) {
    const params = Params.fetch()
    let newTreeElement = _.cloneDeep(treeElement)
    const originalTree = _.cloneDeep(this.state.tree)
    let { tree, index } = this._findTreeElement(originalTree, newTreeElement)
    tree.splice(index, 1, newTreeElement)
    const partyIndex = _.findIndex(newTreeElement.responsible_parties, { id: responsibleParty.id })

    this.setState({ isLoading: true })
    Api.put(Routes.dealCategoryTreeElementResponsibleParty(params.deals, params.categories, treeElement.id, responsibleParty.id, ['deal_entity.entity', 'deal_entity.deal_entity_users.entity_user.user', 'deal_entity_user.entity_user.user']), responsibleParty)
      .then((responsibleParty) => {
        newTreeElement.responsible_parties.splice(partyIndex, 1)
        newTreeElement.responsible_parties.push(responsibleParty)
        this._updateEditableState(originalTree, newTreeElement)
        this.setState({ isLoading: false })
      })
      .catch(error => { ErrorHandling.setErrors(error) })
  }

  deleteResponsibleParty(responsibleParty, treeElement) {
    const params = Params.fetch()
    let newTreeElement = _.cloneDeep(treeElement)
    const originalTree = _.cloneDeep(this.state.tree)
    let { tree, index } = this._findTreeElement(originalTree, newTreeElement)
    tree.splice(index, 1, newTreeElement)
    const partyIndex = _.findIndex(newTreeElement.responsible_parties, { id: responsibleParty.id })
    const isActive = responsibleParty.is_active

    this.setState({ isLoading: true })
    Api.delete(Routes.dealCategoryTreeElementResponsibleParty(params.deals, params.categories, treeElement.id, responsibleParty.id, ['deal_entity.entity', 'deal_entity.deal_entity_users.entity_user.user', 'deal_entity_user.entity_user.user']), responsibleParty)
      .then(() => {
        newTreeElement.responsible_parties.splice(partyIndex, 1)
        //set remaining party, if there is one, to active
        if (newTreeElement.responsible_parties.length && isActive) {
          let activeParty = newTreeElement.responsible_parties[0]
          _.assign(activeParty, { is_active: true })
        }
        this._updateEditableState(originalTree, newTreeElement)
        this.setState({ isLoading: false })
      })
      .catch(error => { ErrorHandling.setErrors(error) })
  }

  sendVersionToDms(treeElement, version, saveAsType, { documentId = '', documentName = '', destinationId = '', versionDmsId = '', comment ='' } = {}) {
    const params = Params.fetch()
    Api.get(Routes.dealCategoryTreeElementAttachmentVersionSendToDms(params.deals, params.categories, treeElement.id, treeElement.attachment.id, version.id, saveAsType, documentId, documentName, encodeURIComponent(destinationId), versionDmsId, comment))
      .then((response) => {
        let newTreeElement = _.cloneDeep(treeElement)
        newTreeElement.attachment.latest_version = response
        // find the correct location in the tree
        const originalTree = _.cloneDeep(this.state.tree)
        let { tree, index } = this._findTreeElement(originalTree, newTreeElement)
        newTreeElement = _.merge({}, tree[index], newTreeElement)

        // update placed versions
        let placedUploads = _.cloneDeep(this.state.placedUploads)
        let versionToUpdate = _.find(placedUploads, {id: response.id})
        // if the placedUploads button hasn't been clicked, the placedUploads state is an empty array.
        if (versionToUpdate) {
          versionToUpdate.version_storageable = response.version_storageable
          this.setState({
            placedUploads
          })
        }


        // insert the updated tree element where the old one was
        tree.splice(index, 1, newTreeElement)

        // don't have to update in placed versions because we don't show the info in the placed versions
        this._updateEditableState(originalTree, newTreeElement)
      })
  }

  deletePlacedUploadVersion(treeElement, removedVersion, latestVersion) {
    // update treeElement
    const originalTree = _.cloneDeep(this.state.tree)
    const { tree, index } = this._findTreeElement(originalTree, treeElement)
    let originalTreeElement = tree[index]
    const removingLatestVersion = originalTreeElement.attachment.latest_version.id === removedVersion.id

    if (latestVersion) {
      originalTreeElement.attachment.latest_version = _.cloneDeep(latestVersion)
    } else {
      originalTreeElement.attachment.latest_version = null
      originalTreeElement.attachment = null
    }

    // update dataRoom counts
    if (this.state.categoryType === 'DiligenceCategory') {
      const noAttachment = originalTreeElement.attachment === null
      const updatingReviewed = removingLatestVersion && treeElement.completion_statuses.length > 0 && treeElement.completion_statuses[0].is_complete
      const reviewedIncrementor = updatingReviewed ? -1 : 0
      const attachmentIncrementor = noAttachment ? -1 : 0

      if (noAttachment || updatingReviewed) {
        this._updateAllReviewedCounts(originalTreeElement, {with_attachment: attachmentIncrementor, completed: reviewedIncrementor}, originalTree)
      }

      if (updatingReviewed) {
        originalTreeElement.completion_statuses = []
      }
    }

    // update tree
    this._updateEditableState(originalTree, originalTreeElement)

    // update placedUploads
    let placedUploads = _.cloneDeep(this.state.placedUploads)
    _.remove(placedUploads, { id: removedVersion.id })
    _.forEach(placedUploads, upload => {
      if(upload.attachment_id === removedVersion.attachment_id && upload.position > removedVersion.position) {
        upload.position = upload.position - 1
      }
    })
    this.setState({ placedUploads })
  }

  exportChecklistInWord() {
    const params = Params.fetch()
    Api.getFile(Routes.dealCategoryExport(params.deals, params.categories))
      .then((blob) => {
        FileSaver.saveAs(blob, `${this.state.deal.title}_checklist.docx`)
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  render() {

    const hasVotingThreshold = _.get(this.state, 'deal.has_voting_threshold', false)

    const sidebar = (
      <div style={styles.sidebar} className="do-not-print">
        <SidebarContainer
          treeElement={this.state.selectedTreeElement}
          selectTreeElement={this.selectTreeElement}
          updateTreeElement={this.updateTreeElement}
          updateEditableTreeElement={this.updateEditableTreeElement}
          edit={this.state.edit}
          setEdit={this.setEdit}
          showUploads={this.state.showUploads}
          uploads={this.state.uploads}
          createOrUpdateCompletionStatus={this.createOrUpdateCompletionStatus}
          deleteTreeElement={this.deleteTreeElement}
          uploadVersion={this.uploadVersion}
          updateVersion={this.updateVersion}
          categoryType={this.state.categoryType}
          setActiveParty={this.setActiveParty}
          publicNotes={this.state.publicNotes}
          teamNotes={this.state.teamNotes}
          notesLoading={this.state.notesLoading}
          noteError={this.state.noteError}
          addNote={this.addNote}
          deleteNote={this.deleteNote}
          getNotes={this.getNotes}
          addRestriction={this.addRestriction}
          updateRestriction={this.updateRestriction}
          deleteRestriction={this.deleteRestriction}
          propagateRestrictionsToChildren={this.propagateRestrictionsToChildren}
          currentDealEntityUser={this.state.currentDealEntityUser}
          currentDealEntityUserIsOwner={this.state.currentDealEntityUserIsOwner}
          deletePlacedUploadVersion={this.deletePlacedUploadVersion}
          initiateUploads={this.initiateUploads}
          ongoingUploads={this.state.ongoingUploads}
          dmsType={this.state.dmsType}
          addResponsibleParty={this.addResponsibleParty}
          updateResponsibleParty={this.updateResponsibleParty}
          deleteResponsibleParty={this.deleteResponsibleParty}
          sendVersionToDms={this.sendVersionToDms}
          hasVotingThreshold={hasVotingThreshold}
        />
      </div>
    )

    const uploads = (
      <div className="do-not-print">
        <Sidebar
          hide={() => this.setState({ showUploads: false })}
          shown={this.state.showUploads}
        >
          <UploadsContainer
            categoryType={this.state.categoryType}
            unplacedUploads={this.state.unplacedUploads}
            placedUploads={this.state.placedUploads}
            setDragging={this.setDragging}
            treeElement={this.state.selectedTreeElement}
            updateTreeElement={this.updateTreeElement}
            edit={this.state.edit}
            setEdit={this.setEdit}
            getPlacedUploads={this.getPlacedUploads}
            placeUpload={this.placeUpload}
            deleteUpload={this.deleteUpload}
            publicNotes={this.state.publicNotes}
            teamNotes={this.state.teamNotes}
            notesLoading={this.state.notesLoading}
            noteError={this.state.noteError}
            addNote={this.addNote}
            deleteNote={this.deleteNote}
            getNotes={this.getNotes}
            ongoingUploads={this.state.ongoingUploads}
            cancelOngoingUpload={this.cancelOngoingUpload}
            cancelAllOngoingUploads={this.cancelAllOngoingUploads}
            clearAllOngoingUploads={this.clearAllOngoingUploads}
            dmsType={this.state.dmsType}
            currentDealEntityUser={this.state.currentDealEntityUser}
            deletePlacedUploadVersion={this.deletePlacedUploadVersion}
          />
        </Sidebar>
      </div>
    )

    let checklist
    const sidebarShown = can(/R/, this.state.features.sidebar) && this.state.selectedTreeElement
    if (this.state.error) {
      checklist = <Error
                    title={<FormattedMessage id='category.errors.unable_to_load_checklist' />}
                    body={<FormattedMessage id='category.errors.contact_support' />}
                    actions={<Button onClick={() => {this.setState({ error: false, loading: true }, this.getTree)}}>Reload Checklist</Button>}
                  />
    } else if (this.state.loading) {
      checklist = <LoadingSpinner />
    } else if (this.state.categoryType === 'ClosingCategory' ) {
      checklist = <div style={styles.checklist(sidebarShown)}>
          <ClosingCategoryContainer
            addTreeElement={this.addTreeElement}
            insertEditableTreeElement={this.insertEditableTreeElement}
            updateEditableTreeElement={this.updateEditableTreeElement}
            removeEditableTreeElement={this.removeEditableTreeElement}
            filter={this.state.filter}
            setFilter={this.setFilter}
            loading={this.state.loading}
            tree={this.state.filteredTree}
            search={this.search}
            searchQuery={this.state.searchQuery}
            selectedTreeElement={this.state.selectedTreeElement}
            selectTreeElement={this.selectTreeElement}
            showUploads={this.state.showUploads}
            toggleUploads={this.toggleUploads}
            unplacedUploadsCount={this.state.unplacedUploads.length}
            draggingUpload={this.state.draggingUpload}
            moveTreeElement={this.moveTreeElement}
            setActiveParty={this.setActiveParty}
            publicNotes={this.state.publicNotes}
            teamNotes={this.state.teamNotes}
            notesLoading={this.state.notesLoading}
            noteError={this.state.noteError}
            addNote={this.addNote}
            deleteNote={this.deleteNote}
            getNotes={this.getNotes}
            currentDealEntityUser={this.state.currentDealEntityUser}
            currentDealEntityUserIsOwner={this.state.currentDealEntityUserIsOwner}
            deletePlacedUploadVersion={this.deletePlacedUploadVersion}
            initiateUploads={this.initiateUploads}
            ongoingUploads={this.state.ongoingUploads}
            dmsType={this.state.dmsType}
            exportChecklistInWord={this.exportChecklistInWord}
            createOrUpdateCompletionStatus={this.createOrUpdateCompletionStatus}
            updateVersion={this.updateVersion}
            updateTreeElement={this.updateTreeElement}
            deleteTreeElement={this.deleteTreeElement}
            uploadVersion={this.uploadVersion}
            sendVersionToDms={this.sendVersionToDms}
            hasVotingThreshold={hasVotingThreshold}
          />
        </div>
    } else if (this.state.categoryType === 'DiligenceCategory') {
      checklist = <div style={styles.checklist(this.state.selectedTreeElement !== null)} className="react-checklist">
          <DataRoomCategoryContainer
            addTreeElement={this.addTreeElement}
            insertEditableTreeElement={this.insertEditableTreeElement}
            updateEditableTreeElement={this.updateEditableTreeElement}
            removeEditableTreeElement={this.removeEditableTreeElement}
            filter={this.state.filter}
            setFilter={this.setFilter}
            loading={this.state.loading}
            tree={this.state.filteredTree}
            search={this.search}
            searchQuery={this.state.searchQuery}
            selectedTreeElement={this.state.selectedTreeElement}
            selectTreeElement={this.selectTreeElement}
            showUploads={this.state.showUploads}
            toggleUploads={this.toggleUploads}
            unplacedUploadsCount={this.state.unplacedUploads.length}
            draggingUpload={this.state.draggingUpload}
            moveTreeElement={this.moveTreeElement}
            createOrUpdateCompletionStatus={this.createOrUpdateCompletionStatus}
            uploadVersion={this.uploadVersion}
            publicNotes={this.state.publicNotes}
            teamNotes={this.state.teamNotes}
            notesLoading={this.state.notesLoading}
            noteError={this.state.noteError}
            addNote={this.addNote}
            deleteNote={this.deleteNote}
            getNotes={this.getNotes}
            currentDealEntityUserIsOwner={this.state.currentDealEntityUserIsOwner}
            currentDealEntityUser={this.state.currentDealEntityUser}
            deletePlacedUploadVersion={this.deletePlacedUploadVersion}
            initiateUploads={this.initiateUploads}
            ongoingUploads={this.state.ongoingUploads}
            dmsType={this.state.dmsType}
          />
        </div>
    }
    return (
      <ProductContext.Provider value={this.state.features}>
        <div style={styles.container}>
          { checklist }
          { (can(/R/, this.state.features.sidebar) && this.state.selectedTreeElement && !this.state.selectedTreeElement.is_restricted) ? sidebar : null }
          { (can(/R/, this.state.features.sidebar) && this.state.selectedTreeElement && this.state.selectedTreeElement.is_restricted) ? <ReservedContainer /> : null }
          { uploads }
          <ChecklistDragLayer
            publicNotes={this.state.publicNotes}
            teamNotes={this.state.teamNotes}
            notesLoading={this.state.notesLoading}
            noteError={this.state.noteError}
            addNote={this.addNote}
            deleteNote={this.deleteNote}
            getNotes={this.getNotes}
          />
        </div>
      </ProductContext.Provider>
    )
  }

}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex'
  },
  checklist: sidebarShown => ({
    width: sidebarShown ?'70%' : '100%'
  }),
  sidebar: {
    width: '30%',
    borderTop: `10px solid ${Colors.button.blue}`,
    borderBottom: `1px solid ${Colors.gray.lightest}`
  }
}

CategoryContainer.propTypes = {
  intl: intlShape.isRequired
}

CategoryContainer = DragDropContext(HTML5Backend)(injectIntl(CategoryContainer))
export { CategoryContainer, DMS_TYPES }

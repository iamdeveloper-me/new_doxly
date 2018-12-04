import _ from 'lodash'
import { Enum } from 'enumify'
import { FormattedMessage } from 'react-intl'
import { normalize, schema } from 'normalizr'
import React from 'react'

import Api from 'helpers/Api'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import SignatureGroup from './SignatureGroup/index.jsx'
import SignatureGroupModal from './SignatureGroupModal/index.jsx'
import SignatureGroupSearch from './SignatureGroupSearch/index.jsx'
import SignatureGroupsEmptyState from './SignatureGroupsEmptyState/index.jsx'
import SigningCapacityForms from './SigningCapacityForms/index.jsx'

export class SIGNING_CAPACITY_FORMS extends Enum {}
SIGNING_CAPACITY_FORMS.initEnum(['individual_form', 'entity_form'])

class SignatureGroups extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      linkedBlocks: [],
      loading: true,
      searchQuery: '',
      selectedSignatureGroup: null,
      showModal: false,
      signatureGroups: {},
      blockCollections: {},
      blocks: {},
      signatureEntities: {},
      signingCapacities: {},
      users: {},
      signatureGroupsSearch: [],
      signatureGroupIsLoading: false,
      selectedForm: null,
      selectedBlock: null,
      selectedBlockCollection: null,
      numberOfPlaceholderSigners: 0,
      votingInterestGroups: [],
      votingInterestGroupsLoading: true
    }
    this.deleteBlockCollection = this.deleteBlockCollection.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.createSignatureGroup = this.createSignatureGroup.bind(this)
    this.updateSignatureGroup = this.updateSignatureGroup.bind(this)
    this.deleteSignatureGroup = this.deleteSignatureGroup.bind(this)
    this.openModal = this.openModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.linkBlocks = this.linkBlocks.bind(this)
    this.unlinkBlocks = this.unlinkBlocks.bind(this)
    this.setSelectedGroup = this.setSelectedGroup.bind(this)
    this.setSearchQuery = this.setSearchQuery.bind(this)
    this.buildBlockCollection = this.buildBlockCollection.bind(this)
    this.setLinkedBlocks = this.setLinkedBlocks.bind(this)
    this.createBlockCollection = this.createBlockCollection.bind(this)
    this.updateBlockCollection = this.updateBlockCollection.bind(this)
    this.setSelectedFormAndGroup = this.setSelectedFormAndGroup.bind(this)
    this.checkForExistingSigner = this.checkForExistingSigner.bind(this)
    this.updateSignatureEntity = this.updateSignatureEntity.bind(this)
    this.updateSigningCapacity = this.updateSigningCapacity.bind(this)
    this.setSelectedBlock = this.setSelectedBlock.bind(this)
    this.getSigningCapacityAttributes = this.getSigningCapacityAttributes.bind(this)

    App.React.FetchSignatureGroupsData = this.fetchData
  }

  fetchData() {
    const params = Params.fetch()
    Api.get(Routes.dealSignatureGroups(params.deals, ['deal', 'block_collections.blocks.signing_capacity.user', 'block_collections.blocks.signature_entity.signing_capacities.user', 'block_collections.blocks.voting_interests']))
      .then((signatureGroups) => {
        this.normalizeSignatureGroups(signatureGroups)
        this.setState({
          numberOfPlaceholderSigners: !_.isEmpty(signatureGroups) ? signatureGroups[0].deal.number_of_placeholder_signers : 0
        })
      })
      .catch(error => ErrorHandling.setErrors(error))

    Api.get(Routes.dealVotingInterestGroups(params.deals))
      .then((votingInterestGroups) => {
        this.setState({
          votingInterestGroups,
          votingInterestGroupsLoading: false
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  componentDidMount() {
    this.fetchData()
  }

  normalizeSignatureGroups(signatureGroups) {
    const normalizedData = normalize(signatureGroups, [ signatureGroup ])
    const updatedState = Object.assign({}, normalizedData.entities, {loading: false })
    this.setState(updatedState, () => this.setSearchQuery(this.state.searchQuery))
  }

  createSignatureGroup(signatureGroup) {
    const params = Params.fetch()
    Api.post(Routes.dealSignatureGroups(params.deals, ['block_collections.blocks.signing_capacity.user', 'block_collections.blocks.signature_entity.signing_capacities.user', 'deal']), signatureGroup)
      .then((signatureGroupResponse) => {
        let signatureGroups = _.cloneDeep(this.state.signatureGroups)
        signatureGroups[signatureGroupResponse.id] = signatureGroupResponse
        const numberOfPlaceholderSigners = signatureGroupResponse.deal.number_of_placeholder_signers

        this.setState({
          signatureGroups,
          numberOfPlaceholderSigners
        }, () => {
          this.scrollBottom()
          this.setSearchQuery(this.state.searchQuery)
        })
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  updateSignatureGroup(signatureGroup) {
    const params = Params.fetch()

    Api.put(Routes.dealSignatureGroup(params.deals, signatureGroup.id, ['block_collections.blocks.signing_capacity.user', 'block_collections.blocks.signature_entity.signing_capacities.user', 'deal']), signatureGroup)
      .then((signatureGroupResponse) => {
        const signatureGroups = _.cloneDeep(this.state.signatureGroups)
        let updateSignatureGroup = signatureGroups[signatureGroup.id]
        updateSignatureGroup.name = signatureGroupResponse.name
        updateSignatureGroup.block_collections = _.map(signatureGroupResponse.block_collections, 'id')

        this.setState({ signatureGroups }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  getDescendants(signatureEntity, signatureEntities) {
    if (!_.isEmpty(signatureEntity.children)) {
      signatureEntities[signatureEntity.id] = signatureEntity
      this.getDescendants(signatureEntity.children[0], signatureEntities)
    } else {
      signatureEntity.signing_capacities = _.map(signatureEntity.signing_capacities, signingCapacity => signingCapacity.id)
      signatureEntities[signatureEntity.id] = signatureEntity
    }
    return signatureEntities
  }

  getSigningCapacities(signatureEntity, signingCapacities) {
    if (!_.isEmpty(signatureEntity.signing_capacities)) {
      _.map(signatureEntity.signing_capacities, signingCapacity => {
        signingCapacity.user = _.isObject(signingCapacity.user) ? signingCapacity.user.id : signingCapacity.user
        signingCapacities[signingCapacity.id] = signingCapacity
      })
    } else {
      this.getSigningCapacities(signatureEntity.children[0], signingCapacities)
    }
    return signingCapacities
  }

  getUsers(signatureEntity, users) {
    if (!_.isEmpty(signatureEntity.signing_capacities)) {
      _.map(signatureEntity.signing_capacities, signingCapacity => {
        users[signingCapacity.user.id] = signingCapacity.user
      })
    } else {
      this.getUsers(signatureEntity.children[0], users)
    }
    return users
  }

  createBlockCollection(block_collection) {
    const params = Params.fetch()
    let signatureGroups = _.cloneDeep(this.state.signatureGroups)
    let blockCollections = _.cloneDeep(this.state.blockCollections)
    let blocks = _.cloneDeep(this.state.blocks)
    let signingCapacities = _.cloneDeep(this.state.signingCapacities)
    let signatureEntities = _.cloneDeep(this.state.signatureEntities)
    let users = _.cloneDeep(this.state.users)

    Api.post(Routes.dealSignatureGroupsBlockCollections(params.deals, this.state.selectedSignatureGroup.id, ['blocks.signing_capacity.user', 'blocks.signature_entity.signing_capacities.user', 'blocks.voting_interests']), { block_collection })
      .then((blockCollectionResponse) => {
        let numberOfPlaceholderSigners = _.cloneDeep(this.state.numberOfPlaceholderSigners)
        let newBlockCollection = _.cloneDeep(blockCollectionResponse)
        let updatedSignatureGroup = signatureGroups[newBlockCollection.signature_group_id]
        // add block collection to signature group array and blockCollections
        updatedSignatureGroup.block_collections.push(newBlockCollection.id)
        let block = newBlockCollection.blocks[0]
        newBlockCollection.blocks = [block.id]
        blockCollections[newBlockCollection.id] = newBlockCollection
        let signatureEntity = block.signature_entity !== null ? block.signature_entity[0] : null
        let signingCapacity = block.signing_capacity !== null ? block.signing_capacity : null
        // update if signature entity or signing capacity
        if (signatureEntity) {
          signatureEntity.block_id = block.id
          block.signature_entity = [signatureEntity.id]
          blocks[block.id] = block
          // update users, signing capacities, and signature enttities objects with new objects
          users = this.getUsers(signatureEntity, users)
          signingCapacities = this.getSigningCapacities(signatureEntity, signingCapacities)
          signatureEntities = this.getDescendants(signatureEntity, signatureEntities)
          // update existing signer names and placeholder count
          let blockSigningCapacities = this.getBlockSigningCapacities(signatureEntity)

          _.each(blockSigningCapacities, signingCapacityId => {
            const signingCapacity = signingCapacities[signingCapacityId]
            signingCapacities = this.updateExistingSigners(signingCapacity, signingCapacities)
          })

          _.each(blockSigningCapacities, signingCapacityId => {
            const signingCapacity = signingCapacities[signingCapacityId]
            if (signingCapacity.placeholder_id !== null) {
              numberOfPlaceholderSigners = numberOfPlaceholderSigners + 1
            }
          })
        } else {
          let user = signingCapacity.user
          // update signing_capacity user to id and add to signingCapacities object
          signingCapacity.user = user.id
          signingCapacities[signingCapacity.id] = signingCapacity
          // update block signing_capacity to id and add to blocks object
          block.signing_capacity = signingCapacity.id
          blocks[block.id] = block
          // add user to users object
          users[user.id] = user
          // udpate placeholder count
          if (signingCapacity.placeholder_id !== null) {
            numberOfPlaceholderSigners = numberOfPlaceholderSigners + 1
          }
          signingCapacities = this.updateExistingSigners(signingCapacity, signingCapacities)
        }

        this.setState({
          signatureGroups,
          blockCollections,
          blocks,
          signingCapacities,
          signatureEntities,
          users,
          selectedForm: null,
          selectedBlock: null,
          selectedBlockCollection: null,
          signatureGroupIsLoading: false,
          selectedSignatureGroup: null,
          numberOfPlaceholderSigners
        }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false
        })
      )})
  }

  getBlockSigningCapacities(signatureEntity) {
    if (_.isEmpty(signatureEntity.signing_capacities)) {
      this.getBlockSigningCapacities(signatureEntity.children[0])
    } else {
      return signatureEntity.signing_capacities
    }
  }

  deleteBlockCollection(blockCollection, signatureGroup) {
    const params = Params.fetch()

    this.setState({
      selectedSignatureGroup: signatureGroup,
      signatureGroupIsLoading: true
    })

    Api.delete(Routes.dealSignatureGroupsBlockCollection(params.deals, signatureGroup.id, blockCollection.id))
      .then(() => {
        let signatureGroups = _.cloneDeep(this.state.signatureGroups)
        let blockCollections = _.cloneDeep(this.state.blockCollections)
        let blocks = _.cloneDeep(this.state.blocks)
        let signatureEntites = _.cloneDeep(this.state.signatureEntities)
        let signingCapacities = _.cloneDeep(this.state.signingCapacities)
        let users = _.cloneDeep(this.state.users)
        // get all signingCapacities on block
        let block = blockCollection.blocks[0]
        block = _.isObject(block) ? blocks[block.id] : blocks[block]
        const blockSigningCapacities = block.signing_capacity !== null ? [block.signing_capacity] : this.getBlockSigningCapacities(signatureEntites[block.signature_entity[0]])
        // remove signingCapacities form signingCapacities object
        _.each(blockSigningCapacities, signingCapacityId => {
          let signingCapacity = _.find(signingCapacities, { id: signingCapacityId })
          delete signingCapacities[signingCapacityId]
          if (signingCapacity) {
            let userId = signingCapacity.user
            let exisingSigner = _.find(signingCapacities, { user: userId })
            if (!exisingSigner) {
              delete users[userId]
            }
          }
        })
        let updatedSignatureGroup = signatureGroups[signatureGroup.id]
        updatedSignatureGroup.block_collections = _.filter(updatedSignatureGroup.block_collections, blockCollectionId => blockCollectionId !== blockCollection.id)

        // remove block and blockCollection from corresponding objects
        delete blocks[block.id]
        delete blockCollections[blockCollection.id]

        this.setState({
          signingCapacities,
          users,
          blocks,
          blockCollections,
          signatureGroups,
          selectedBlock: null,
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false
        }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false
        })
      )})
  }

  updateBlockCollection(blockCollection, signatureGroup) {
    const params = Params.fetch()

    Api.put(Routes.dealSignatureGroupsBlockCollection(params.deals, signatureGroup.id, blockCollection.id), blockCollection)
      .then((blockCollectionResponse) => {
        let blockCollections = _.cloneDeep(this.state.blockCollections)
        let blockCollection = blockCollections[blockCollectionResponse.id]
        blockCollection.is_consolidated = blockCollectionResponse.is_consolidated

        this.setState({
          blockCollections
        }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedSignatureGroup: null
        })
      )})
  }

  updateSignatureEntity(block, originalSignatureEntity) {
    const params = Params.fetch()
    const signatureEntity = block.signature_entity
    const signatureEntityId = originalSignatureEntity.id
    const blockCollectionId = this.state.selectedBlockCollection
    const signatureGroupId = this.state.blockCollections[blockCollectionId].signature_group_id
    let numberOfPlaceholderSigners = _.cloneDeep(this.state.numberOfPlaceholderSigners)
    let blocks = _.cloneDeep(this.state.blocks)
    let signatureEntities = _.cloneDeep(this.state.signatureEntities)
    let signingCapacities = _.cloneDeep(this.state.signingCapacities)
    let users = _.cloneDeep(this.state.users)
    let signature_entity = _.pick(signatureEntity, ['id', 'name', 'descendants', 'signing_capacities', 'primary_address', 'copy_to_address'])
    // include signing capacities that need to be destroyed for backend
    _.each(originalSignatureEntity.signing_capacities, signingCapacity => {
      if (!_.find(signature_entity.signing_capacities, { id: signingCapacity.id })) {
        signature_entity.signing_capacities.push(_.assign(signingCapacity, { destroy: true }))
      }
    })

    Api.put(Routes.dealSignatureGroupBlockCollectionSignatureEntity(params.deals, signatureGroupId, blockCollectionId, signatureEntityId, ['signing_capacities.user', 'block.voting_interests']), { signature_entity, block })
      .then((signatureEntityResponse) => {
        // remove signature entity - backend is creating new, update entity on update
        signatureEntities = _.omit(signatureEntities, signatureEntityId)

        const signatureEntity = signatureEntityResponse[0]
        let block = blocks[signatureEntity.root.block_id]
        block.signature_entity = [signatureEntity.id]
        signatureEntity.block_id = block.id
        signatureEntities[signatureEntity.id] = signatureEntity
        block.voting_interests = _.cloneDeep(signatureEntity.block.voting_interests) // since this code is hacked together anyway, I just want to try not to make changes outside of what I absolutely have to
        // get all signingCapacities on block
        let blockSigningCapacities = this.getBlockSigningCapacities(signatureEntity)
        // update existing signer names if needed
        _.each(blockSigningCapacities, signingCapacity => {
          this.updateExistingSigners(signingCapacity, signingCapacities)
        })
        // update placholder count
        _.each(blockSigningCapacities, signingCapacity => {
          const originalSigningCapacity = signingCapacities[signingCapacity.id]
          const existingPlaceholder = (!_.isEmpty(originalSigningCapacity) && originalSigningCapacity.placeholder_id === null) &&  signingCapacity.placeholder_id !== null
          const newPlaceholder = _.isEmpty(originalSigningCapacity) && signingCapacity.placeholder_id !== null

          if (existingPlaceholder || newPlaceholder) {
            numberOfPlaceholderSigners = numberOfPlaceholderSigners + 1
          }
        })
        // update signing capacities and signature entities objects with new objects
        users = this.getUsers(signatureEntity, users)
        signingCapacities = this.getSigningCapacities(signatureEntity, signingCapacities)
        signatureEntities = this.getDescendants(signatureEntity, signatureEntities)

        this.setState({
          blocks,
          signatureEntities,
          signingCapacities,
          users,
          selectedForm: null,
          selectedBlock: null,
          selectedBlockCollection: null,
          numberOfPlaceholderSigners
        }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedSignatureGroup: null,
          selectedBlock: null,
          selectedBlockCollection: null,
          selectedForm: null
        })
      )})
  }

  updateExistingSigners(signingCapacity, signingCapacities) {
    const userId = _.isObject(signingCapacity.user) ? signingCapacity.user.id : signingCapacity.user
    let existingSigners = _.filter(_.map(signingCapacities), { user: userId })

    _.each(existingSigners, signer => {
      if (signer.id !== signingCapacity.id) {
        signer.first_name = signingCapacity.first_name
        signer.last_name = signingCapacity.last_name
        signer.placeholder_id = signingCapacity.placeholder_id
        signer.name = signingCapacity.name
        signer.title = signingCapacity.title
        signingCapacities[signer.id] = signer
      }
    })
    return signingCapacities
  }

  updateSigningCapacity(block, originalSigningCapacity) {
    const params = Params.fetch()
    const signatureGroupId = this.state.signingCapacities[originalSigningCapacity.id].signature_group.id
    const blockCollectionId = this.state.selectedBlockCollection
    const signingCapacityId = originalSigningCapacity.id
    let blocks = _.cloneDeep(this.state.blocks)
    let numberOfPlaceholderSigners = _.cloneDeep(this.state.numberOfPlaceholderSigners)
    let signingCapacities = _.cloneDeep(this.state.signingCapacities)
    let users = _.cloneDeep(this.state.users)

    Api.put(Routes.dealSignatureGroupBlockCollectionSigningCapacity(params.deals, signatureGroupId, blockCollectionId, signingCapacityId, ['block.voting_interests']), { signing_capacity: block.signing_capacity, block: block } )
      .then((signingCapacityResponse) => {
        if (_.isEmpty(users[signingCapacityResponse.user.id])) {
          users[signingCapacityResponse.user.id] = signingCapacityResponse.user
        } else {
          _.merge(users[signingCapacityResponse.user.id], signingCapacityResponse.user)
        }
        // update signing capacity
        signingCapacityResponse.user = signingCapacityResponse.user.id
        _.merge(signingCapacities[signingCapacityResponse.id], signingCapacityResponse)
        // update number of placeholder on deal if needed
        if (originalSigningCapacity.placeholder_id === null && signingCapacity.placeholder_id !== null) {
          numberOfPlaceholderSigners = numberOfPlaceholderSigners + 1
        }
        signingCapacities = this.updateExistingSigners(signingCapacityResponse, signingCapacities)

        let block = blocks[signingCapacityResponse.block.id]
        block.voting_interests = _.cloneDeep(signingCapacityResponse.block.voting_interests) // since this code is hacked together anyway, I just want to try not to make changes outside of what I absolutely have to

        this.setState({
          signingCapacities,
          blocks,
          users,
          selectedSignatureGroup: null,
          selectedForm: null,
          selectedBlock: null,
          selectedBlockCollection: null,
          numberOfPlaceholderSigners
        }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedForm: null,
          selectedSignatureGroup: null,
          selectedBlock: null,
          selectedBlockCollection: null
        })
      )})
  }

  deleteSignatureGroup(signatureGroupId) {
    const prevState = _.cloneDeep(this.state)
    let signatureGroups = _.cloneDeep(this.state.signatureGroups)
    signatureGroups = _.omit(signatureGroups, signatureGroupId)

    const params = Params.fetch()
    Api.delete(Routes.dealSignatureGroup(params.deals, signatureGroupId))
      .then(() => {
        this.setState({
          selectedSignatureGroup: null,
          signatureGroups
        }, () => this.setSearchQuery(this.state.searchQuery))
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  openModal() {
    this.setState({ showModal: true })
  }

  setLinkedBlocks(linkedBlocks) {
    this.setState({ linkedBlocks })
  }

  getSigningCapacityAttributes(signingCapacity, isIndividual=false) {
    const { users } = this.state
    const user = signingCapacity.user
    const hasPlaceholder = signingCapacity.placeholder_id !== null
    // get attributes to include - different for individual or entity signing capacities
    const attributes = ['first_name', 'last_name', 'title', 'name', 'placeholder_id', 'user']
    if (isIndividual) {
      attributes.push('primary_address', 'copy_to_address')
    }
    let signingCapacityAttributes = _.pick(signingCapacity, attributes)
    // update attributes depending on whether it is an unnamed signer or not
    if (hasPlaceholder) {
      signingCapacityAttributes['first_name'] = ''
      signingCapacityAttributes['last_name'] = ''
    }
    // add attributes (email & user_placeholder) that aren't actually on signing_capacity & id
    signingCapacityAttributes['id'] = signingCapacity.id
    signingCapacityAttributes['use_placeholder_name'] = hasPlaceholder
    signingCapacityAttributes['user'] = { email: _.isObject(user) ? user.email : users[user].email }

    return signingCapacityAttributes
  }

  getAllDescendants(signatureEntity, children) {
    if (!_.isEmpty(signatureEntity.children)) {
      children.push(signatureEntity.children[0])
      this.getAllDescendants(signatureEntity.children[0], children)
    }
    return children
  }

  setSelectedBlock(block) {
    let selectedForm
    let selectedBlock = _.cloneDeep(block)
    const selectedBlockCollection = selectedBlock.block_collection_id

    if (selectedBlock && block.signature_entity !== null) {
      const allSigningCapacities = this.state.signingCapacities
      selectedForm = SIGNING_CAPACITY_FORMS.entity_form
      selectedBlock = this.state.signatureEntities[block.signature_entity[0]]
      selectedBlock.descendants = this.getAllDescendants(selectedBlock, [])

      let signingCapacities = !_.isEmpty(selectedBlock.descendants) ? _.last(selectedBlock.descendants).signing_capacities : selectedBlock.signing_capacities
      signingCapacities = _.map(signingCapacities, signingCapacity => {
        return this.getSigningCapacityAttributes(_.isObject(signingCapacity) ? signingCapacity : allSigningCapacities[signingCapacity])
      })
      selectedBlock.signing_capacities = _.orderBy(signingCapacities, 'placeholder_id', 'asc')
    } else {
      selectedForm  = SIGNING_CAPACITY_FORMS.individual_form
      selectedBlock = this.state.signingCapacities[block.signing_capacity]
      selectedBlock = this.getSigningCapacityAttributes(selectedBlock, true)
    }

    this.setState({
      selectedForm,
      selectedBlock,
      selectedBlockCollection,
      selectedSignatureGroup: _.find(this.state.signatureGroups, selectedBlockCollection.signature_group_id)
    })
  }

  buildBlockCollection(blockCollection) {
    let linkedBlocks = _.cloneDeep(this.state.linkedBlocks)
    const isIncluded = linkedBlocks.filter(linkedBlock => linkedBlock.id === blockCollection.id).length > 0

    isIncluded ? _.remove(linkedBlocks, { 'id': blockCollection.id }) : linkedBlocks.push(blockCollection)

    this.setLinkedBlocks(linkedBlocks)
  }

  linkBlocks(linkedBlocks, signatureGroup) {
    const params = Params.fetch()
    const linkBlockCollectionsIds = _.map(linkedBlocks, 'id')
    const blockCollectionIds = signatureGroup.block_collections

    // return block collections that aren't being linked
    let updatedBlockCollections = _.filter(blockCollectionIds, (blockCollectionId) => {
      if (!linkBlockCollectionsIds.includes(blockCollectionId)) {
        return blockCollectionId
      }
    })

    this.setState({
      selectedSignatureGroup: signatureGroup,
      signatureGroupIsLoading: true
    })

    Api.put(Routes.dealSignatureGroupBlockCollectionsLinkBlocks(params.deals, signatureGroup.id, ['blocks.signing_capacity.user', 'blocks.signature_entity.signing_capacities.user']), linkBlockCollectionsIds)
      .then((blockCollectionResponse) => {
        let signatureGroups = _.cloneDeep(this.state.signatureGroups)
        let blockCollections = _.cloneDeep(this.state.blockCollections)
        let blocks = _.cloneDeep(this.state.blocks)
        let updatedSignatureGroup = signatureGroups[signatureGroup.id]
        const blockCollectionBlocks = blockCollectionResponse.blocks
        const blockIds = _.map(blockCollectionBlocks, 'id')

        // add block collection id to block collections
        updatedBlockCollections.push(blockCollectionResponse.id)
        // update block collection ids on signature group
        updatedSignatureGroup.block_collections = updatedBlockCollections
        // change block collection objects to array of ids
        blockCollectionResponse.blocks = blockIds
        // find block colleciton and update with response
        blockCollections[blockCollectionResponse.id] = blockCollectionResponse
        // update linked blocks to belong to correct block collection and update position on block
        _.map(blocks, block => {
          if (_.includes(blockIds, block.id)) {
            block.block_collection_id = blockCollectionResponse.id
            const currentBlock = _.find(blockCollectionBlocks, {id: block.id})
            block.position = currentBlock ? currentBlock.position : null
          }
        })

        this.setState({
          signatureGroups,
          blockCollections,
          blocks,
          linkedBlocks: [],
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false
        })
        this.setSearchQuery(this.state.searchQuery)
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false,
          linkedBlocks: []
        })
      )})
  }

  unlinkBlocks(block, blockCollection, signatureGroup) {
    const params = Params.fetch()
    this.setState({
      selectedSignatureGroup: signatureGroup,
      signatureGroupIsLoading: true
    })
    Api.put(Routes.dealSignatureGroupBlockCollectionsUnlinkBlocks(params.deals, signatureGroup.id, ['blocks.signing_capacity.user', 'blocks.signature_entity.signing_capacities.user']), block)
      .then((blockCollectionResponse) => {
        let signatureGroups = _.cloneDeep(this.state.signatureGroups)
        let blockCollections = _.cloneDeep(this.state.blockCollections)
        let updatedSignatureGroup = signatureGroups[signatureGroup.id]
        let updatedBlockCollection = blockCollections[blockCollection.id]

        _.remove(updatedBlockCollection.blocks, blockId => blockId === block.id)
        updatedSignatureGroup.block_collections.push(blockCollectionResponse.id)
        blockCollectionResponse.blocks = _.map(blockCollectionResponse.blocks, 'id')
        blockCollections[blockCollectionResponse.id] = blockCollectionResponse

        this.setState({
          signatureGroups,
          blockCollections,
          linkedBlocks: [],
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false
        })
        this.setSearchQuery(this.state.searchQuery)
      })
      .catch(error => { ErrorHandling.setErrors(error, () =>
        this.setState({
          selectedSignatureGroup: null,
          signatureGroupIsLoading: false,
          linkedBlocks: []
        })
      )})
  }

  hideModal() {
    this.setState({
      showModal: false,
      selectedSignatureGroup: null
    })
  }

  setSelectedGroup(signatureGroup) {
    this.setState({ selectedSignatureGroup: signatureGroup })
  }

  setSearchQuery(query) {
    const unfilteredSignatureGroupsList = _.cloneDeep(this.state.signatureGroups)
    let filteredSignatureGroupsList = []
    const matches = str => str.toLowerCase().includes(query.trim().toLowerCase())
    const addressMatches = address => (
      address && (
        matches(address.address_line_one) ||
        matches(address.address_line_two) ||
        matches(address.city) ||
        matches(address.postal_code) ||
        matches(address.state_or_province)
      )
    )
    const signingCapacityMatches = signingCapacityId => {
      const signingCapacity = this.state.signingCapacities[signingCapacityId]
      return signingCapacity && (
        matches(signingCapacity.name) ||
        (signingCapacity.title !== '[Title]' && matches(signingCapacity.title)) ||
        addressMatches(signingCapacity.primary_address) ||
        addressMatches(signingCapacity.copy_to_address)
      )
    }
    const signatureEntityMatches = signatureEntity => {
      return signatureEntity && (
        matches(signatureEntity.name) ||
        _.some(signatureEntity.signing_capacities, signingCapacity => signingCapacityMatches(signingCapacity)) ||
        addressMatches(signatureEntity.primary_address) ||
        addressMatches(signatureEntity.copy_to_address) ||
        signatureEntityMatches(_.first(signatureEntity.children))
      )
    }

    // For each signature group, check if any of the block collections match the search or if the signature group name matches
    _.each(unfilteredSignatureGroupsList, signatureGroup => {
      if (matches(signatureGroup.name)) {
        // if the name matches, add it
        filteredSignatureGroupsList.push(signatureGroup)
      } else {
        // check if any of the block collections match
        // For each block, check if the signature entity or signing capacity matches the search
        let blockCollections = (
          _.filter(signatureGroup.block_collections, blockCollectionId => (
            _.some(this.state.blockCollections[blockCollectionId].blocks, blockId => (
              signingCapacityMatches(this.state.blocks[blockId].signing_capacity) ||
              signatureEntityMatches(this.state.signatureEntities[_.first(this.state.blocks[blockId].signature_entity)])
            ))
          ))
        )
        // add the matching block collections to the signature group and add to filtered list
        if (!_.isEmpty(blockCollections)) {
          signatureGroup.block_collections = blockCollections
          filteredSignatureGroupsList.push(signatureGroup)
        }
      }
    })

    this.setState({
      signatureGroupsSearch: filteredSignatureGroupsList,
      searchQuery: query
    })
  }

  setSelectedFormAndGroup(selectedForm, selectedSignatureGroup) {
    if (selectedForm === null) {
      this.setState({
        selectedForm: null,
        selectedBlock: null,
        selectedBlockCollection: null,
        selectedSignatureGroup: null
      })
    } else {
      this.setState({
        selectedForm,
        selectedSignatureGroup
      })
    }
  }

  scrollBottom() {
    // this relies up class names and elements that exist outside of react. If scrolling breaks, it's probably because something changed outside of it.
    $('.row.deals').animate({scrollTop: $('.row.deals').prop('scrollHeight')}, 'slow')
  }

  checkForExistingSigner(signer) {
    const existingUser = _.find(_.cloneDeep(this.state.users), { email: _.trim(signer.user.email).toLowerCase() })
    let signingCapacities = _.map(_.omit(_.cloneDeep(this.state.signingCapacities), signer.id))

    if (existingUser) {
      signingCapacities = _.filter(signingCapacities, signingCapacity => {
        const userId = _.isObject(signingCapacity.user) ? signingCapacity.user.id : signingCapacity.user

        if (userId === existingUser.id) {
          return signingCapacity
        }
      })

      if (!_.isEmpty(signingCapacities)) {
        const signingCapacity = signingCapacities[0]
        const signerName = signer.use_placeholder_name ? `Unnamed Signer ${signer.placeholder_id}` : [_.trim(signer.first_name), _.trim(signer.last_name)].join(' ')

        if (!_.isEqual(signingCapacity.name.toLowerCase(), signerName.toLowerCase())) {
          return signingCapacity
        }
      }
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={styles.loading}>
          <LoadingSpinner />
        </div>
      )
    }

    // TODO: always use `block_id`...look, I don't know why it is sometimes one and sometimes the other, but I don't want to risk breaking it by refactoring
    let selectedBlockId = null
    if(this.state.selectedBlock) {
      selectedBlockId = this.state.selectedBlock.blockId === undefined ? this.state.selectedBlock.block_id : this.state.selectedBlock.blockId
      if (!selectedBlockId) {
        selectedBlockId = _.find(this.state.blocks, { signing_capacity: this.state.selectedBlock.id }).id
      }
    }
    return (
      <div className='whiteout-ui'>
        <div style={styles.toolbar}>
          <div style={styles.search}>
            <SignatureGroupSearch
              searchQuery={this.state.searchQuery}
              setSearchQuery={this.setSearchQuery}
            />
          </div>
          <div style={styles.button}>
            <Button
              type='primary'
              text={<FormattedMessage id='signature_management.signature_groups.add_signature_group' />}
              onClick={this.openModal}
            />
          </div>
        </div>
        <div className='whiteout-ui' ref={signatureGroupContainer => this.signatureGroupContainer = signatureGroupContainer}>
          {_.isEmpty(this.state.signatureGroups) ?
            <SignatureGroupsEmptyState />
          :
            _.map(this.state.signatureGroupsSearch, signatureGroup => (
              <SignatureGroup
                key={signatureGroup.id}
                signatureGroup={signatureGroup}
                allBlockCollections={this.state.blockCollections}
                allBlocks={this.state.blocks}
                allSignatureEntities={this.state.signatureEntities}
                allSigningCapacities={this.state.signingCapacities}
                linkedBlocks={this.state.linkedBlocks}
                signatureGroupIsLoading={this.state.signatureGroupIsLoading}
                selectedSignatureGroup={this.state.selectedSignatureGroup}
                setLinkedBlocks={this.setLinkedBlocks}
                buildBlockCollection={this.buildBlockCollection}
                deleteBlockCollection={this.deleteBlockCollection}
                openModal={this.openModal}
                setSelectedGroup={this.setSelectedGroup}
                deleteSignatureGroup={this.deleteSignatureGroup}
                linkBlocks={this.linkBlocks}
                unlinkBlocks={this.unlinkBlocks}
                updateBlockCollection={this.updateBlockCollection}
                setSelectedFormAndGroup={this.setSelectedFormAndGroup}
                setSelectedBlock={this.setSelectedBlock}
                scrollToDomRef={this.scrollToDomRef}
              />
            ))
          }
          <SignatureGroupModal
            signatureGroup={this.state.selectedSignatureGroup}
            showModal={this.state.showModal && this.state.selectedForm === null}
            hideModal={this.hideModal}
            createSignatureGroup={this.createSignatureGroup}
            updateSignatureGroup={this.updateSignatureGroup}
          />
          <SigningCapacityForms
            showForm={this.state.selectedForm !== null && !this.state.showModal}
            selectedBlock={this.state.selectedBlock}
            realSelectedBlock={this.state.blocks[selectedBlockId]}
            checkForExistingSigner={this.checkForExistingSigner}
            numberOfPlaceholderSigners={this.state.numberOfPlaceholderSigners}
            selectedForm={this.state.selectedForm}
            signingCapacities={this.state.signingCapacities}
            setSelectedFormAndGroup={this.setSelectedFormAndGroup}
            createBlockCollection={this.createBlockCollection}
            updateSignatureEntity={this.updateSignatureEntity}
            updateSigningCapacity={this.updateSigningCapacity}
            hasVotingThreshold={this.state.selectedSignatureGroup ? this.state.selectedSignatureGroup.deal.has_voting_threshold : false}
            votingInterestGroups={this.state.votingInterestGroups}
            votingInterestGroupsLoading={this.state.votingInterestGroupsLoading}
          />
        </div>
      </div>
    )
  }

}

const user = new schema.Entity('users')
const signingCapacity = new schema.Entity('signingCapacities', {
  user: user
}, {
  processStrategy: (value, parent, key) => (_.assign(
    value,
    {
      entity: parent
    }
  ))
})
const signatureEntity = new schema.Entity('signatureEntities', {
  signing_capacities: [signingCapacity]
}, {
  processStrategy: (value, parent, key) => (_.assign(
    value,
    {
      blockId: parent.id
    }
  ))
})
const block = new schema.Entity('blocks', {
  signature_entity: [signatureEntity],
  signing_capacity: signingCapacity
})
const blockCollection = new schema.Entity('blockCollections', {
  blocks: [block]
})
const signatureGroup = new schema.Entity('signatureGroups',{
  block_collections: [blockCollection]
})

const styles = {
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2rem 0 2rem'
  },
  search: {
    flexBasis: '75%'
  },
  button: {
    alignSelf: 'baseline'
  },
  loading: {
    marginTop: '8rem'
  }
}

export default SignatureGroups

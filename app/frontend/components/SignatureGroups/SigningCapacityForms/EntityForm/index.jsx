import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import AddressInformation from './AddressInformation/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import EntityInformation from './EntityInformation/index.jsx'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'components/Whiteout/Modal/index.jsx'
import SetupVotingInterests from 'components/SignatureGroups/SigningCapacityForms/SetupVotingInterests/index.jsx'

let STAGES = ['entity_information', 'address_information', 'voting_interests']

class EntityForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedStage: null,
      nameAlerts: {},
      signerAlerts: [],
      updateExistingSigners: false,
      warnings: {},
      formSubmitted: false,
      placeholderCount: 0,
      block_collection: {
        block: {
          signature_entity: {
            name: '',
            descendants: [],
            signing_capacities: [
              {
                id: null,
                placeholder_id: null,
                use_placeholder_name: false,
                first_name: '',
                last_name: '',
                title: '',
                user: {
                  email: ''
                }
              }
            ],
            primary_address: {
              address_line_one: '',
              address_line_two: '',
              city: '',
              state_or_province: '',
              postal_code: ''
            },
            copy_to_address: {
              use_copy_to: false,
              address_line_one: '',
              address_line_two: '',
              city: '',
              state_or_province: '',
              postal_code: ''
            }
          },
          voting_interests: this.props.hasVotingThreshold && this.props.realSelectedBlock ? this.props.realSelectedBlock.voting_interests : []
        }
      }
    }
    this.hideModal = this.hideModal.bind(this)
    this.submitForm = _.debounce(this.submitForm.bind(this), 250)
    this.addDescendant = this.addDescendant.bind(this)
    this.removeDescendant = this.removeDescendant.bind(this)
    this.addSigningCapacity = this.addSigningCapacity.bind(this)
    this.removeSigningCapacity = this.removeSigningCapacity.bind(this)
    this.getModalBody = this.getModalBody.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onNext = this.onNext.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
    this.formValidations = this.formValidations.bind(this)
    this.updateVotingInterest = this.updateVotingInterest.bind(this)
    this.addPlaceholder = this.addPlaceholder.bind(this)
    this.subtractPlaceholder = this.subtractPlaceholder.bind(this)

    STAGES = this.props.hasVotingThreshold ? STAGES : _.filter(STAGES, stage => stage !== 'voting_interests')
  }

  componentDidMount() {
    const { selectedSignatureEntity } = this.props
    let block_collection = _.cloneDeep(this.state.block_collection)
    let { signature_entity } = block_collection.block

    if (selectedSignatureEntity !== null) {
      selectedSignatureEntity['primary_address'] = selectedSignatureEntity.primary_address || signature_entity.primary_address
      selectedSignatureEntity['copy_to_address'] = selectedSignatureEntity.copy_to_address && (selectedSignatureEntity.copy_to_address.use_copy_to === undefined || selectedSignatureEntity.copy_to_address.use_copy_to) ? _.assign(selectedSignatureEntity.copy_to_address, { 'use_copy_to': true }) : signature_entity.copy_to_address
      _.assign(signature_entity, selectedSignatureEntity)
    }

    this.setState({
      selectedStage: _.first(STAGES),
      block_collection
    })
  }

  hideModal() {
    this.setState({
      selectedStage: null,
      formSubmitted: false,
      blockCollection: {}
    }, () => (
      this.props.setSelectedForm(null)
    ))
  }

  addDescendant(){
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signature_entity = block_collection.block.signature_entity

    signature_entity.descendants.push({name: '', title: ''})
    this.setState({ block_collection })
  }

  removeDescendant(index){
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signature_entity = block_collection.block.signature_entity

    signature_entity.descendants.splice(index, 1)
    this.setState({ block_collection })
  }

  addSigningCapacity(){
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signature_entity = block_collection.block.signature_entity

    if (signature_entity.signing_capacities.length < 2) {
      signature_entity.signing_capacities.push({first_name: '', last_name: '', title: '', placeholder_id: null, use_placeholder_name: false, user: { email: ''}})
      this.setState({ block_collection })
    }
  }

  removeSigningCapacity(index){
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signing_capacities = block_collection.block.signature_entity.signing_capacities
    let signerAlerts = _.cloneDeep(this.state.signerAlerts)

    if (!_.isEmpty(signerAlerts)) {
      signerAlerts = _.filter(signerAlerts, { 'signer_position': !index })
    }

    if (signing_capacities[index].placeholder_id !== null) {
      this.subtractPlaceholder(index, true)
    } else {
      this.removeSigningCapacityUpdate(index)
    }
  }

  removeSigningCapacityUpdate(index) {
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signing_capacities = block_collection.block.signature_entity.signing_capacities
    let signerAlerts = _.cloneDeep(this.state.signerAlerts)

    if (signing_capacities.length > 1) {
      signing_capacities = signing_capacities.splice(index, 1)
    } else {
      let signingCapacity = signing_capacities[0]
      signingCapacity['id'] = null
      signingCapacity['placeholder_id'] = null
      signingCapacity['use_placeholder_name'] = false
      signingCapacity['first_name'] = ''
      signingCapacity['last_name'] = ''
      signingCapacity['title'] = ''
      signingCapacity['user']['email'] = null
    }
    this.setState({
      block_collection,
      signerAlerts
    })
  }

  submitForm() {
    const { selectedSignatureEntity } = this.props
    const { block_collection, updateExistingSigners } = this.state

    if (selectedSignatureEntity !== null) {
      this.props.updateSignatureEntity(block_collection.block, selectedSignatureEntity)
    } else {
      this.props.createBlockCollection(block_collection, updateExistingSigners)
    }
    this.setState({
      formSubmitted: false
    }, () => {
      this.props.setSelectedForm(null)
    })
  }

  onBack() {
    this.setState({
      selectedStage: STAGES[_.indexOf(STAGES, this.state.selectedStage)-1]
    })
  }

  onNext(updateExistingSigners=false) {
    const { nameAlerts, signerAlerts, selectedStage } = this.state

    if ((_.isEmpty(nameAlerts) && _.isEmpty(signerAlerts)) || updateExistingSigners || selectedStage === STAGES[1]) {
      this.setState({
        selectedStage: STAGES[_.indexOf(STAGES, selectedStage)+1],
        formSubmitted: false,
        updateExistingSigners
      })
    }
  }

  isValidField(field) {
    return _.trim(field) !== ''
  }

  formValidations() {
    const { selectedStage, signerAlerts } = this.state
    const canProceed = _.map(signerAlerts, alert => (_.isEmpty(_.omit(alert, ['existing_signer', 'signer_position']))))

    if ((!_.isEmpty(signerAlerts) && !_.includes(canProceed, false)) && _.isEmpty(this.getNameErrors())) {
      this.setState({
        nameAlerts: {},
        signerAlerts: [],
        formSubmitted: true
      }, () => {
        selectedStage === _.last(STAGES) ? this.submitForm() : this.onNext(true)
      })
    } else {
      const nameAlerts = this.getNameErrors()
      const signerAlerts = this.signingCapacityAlerts()

      this.setState({
        nameAlerts,
        signerAlerts,
        formSubmitted: true
      }, () => {
        if ((_.isEmpty(nameAlerts) && _.isEmpty(signerAlerts)) || this.state.selectedStage === STAGES[1]) {
          this.state.selectedStage === _.last(STAGES) ? this.submitForm() : this.onNext()
        }
      })
    }
  }

  getNameErrors() {
    const { block_collection } = this.state
    const { signature_entity } = block_collection.block
    let nameAlerts = {}
    let blankSignerName = []

    const emails = _.map(signature_entity.signing_capacities, signingCapacity => (_.trim(signingCapacity.user.email).toLowerCase()))
    nameAlerts['blank_entity_name'] = !this.isValidField(signature_entity.name)
    nameAlerts['blank_signer_name'] = _.includes(blankSignerName, true)

    if ((!nameAlerts['blank_signer_name'] && !nameAlerts['invalid_email']) && emails.length > 1) {
      nameAlerts['matching_signers'] = _.isEqual(emails[0], emails[1]) && !_.includes(emails, '')
    }

    return _.pickBy(nameAlerts, _.identity)
  }

  signingCapacityAlerts() {
    const { block_collection } = this.state
    const { signing_capacities } = block_collection.block.signature_entity
    let signerAlerts = []

    _.each(signing_capacities, (signingCapacity, index) => {
      let newAlert = {}
      const emailValidation = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/
      const email = _.trim(signingCapacity.user.email).toLowerCase()
      newAlert['invalid_email'] = email ? !emailValidation.test(email) : false
      newAlert['blank_signer_name'] = !signingCapacity.use_placeholder_name ? !(this.isValidField(signingCapacity.first_name) && this.isValidField(signingCapacity.last_name)) : false

      if (this.isValidField(signingCapacity.user.email)) {
        const existingSigner = this.props.checkForExistingSigner(signingCapacity)

        newAlert['existing_signer'] = existingSigner || null
        newAlert['existing_signer_has_sent_packets'] = existingSigner ? existingSigner.has_sent_packets : false
      }
      newAlert = _.pickBy(newAlert, _.identity)

      if (!_.isEmpty(newAlert)) {
        newAlert['signer_position'] = index
        signerAlerts.push(newAlert)
      }
    })
    return signerAlerts
  }

  addPlaceholder(index) {
    const { selectedSignatureEntity } = this.props
    let { placeholderCount } = this.state
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signature_entity = block_collection.block.signature_entity
    _.set(signature_entity, `signing_capacities[${index}].use_placeholder_name`, true)

    if (selectedSignatureEntity === null || !signature_entity.signing_capacities[`${index}`] || signature_entity.signing_capacities[`${index}`].placeholder_id === null) {
      placeholderCount = placeholderCount + 1
      _.set(signature_entity, `signing_capacities[${index}].placeholder_id`, this.props.numberOfPlaceholderSigners + placeholderCount)
    }

    this.setState({
      placeholderCount,
      block_collection
    })
  }

  subtractPlaceholder(index, deleteSigner=false) {
    const { selectedSignatureEntity } = this.props
    let { placeholderCount } = this.state
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signature_entity = block_collection.block.signature_entity

    _.set(signature_entity, `signing_capacities[${index}].use_placeholder_name`, false)

    if (selectedSignatureEntity === null || !selectedSignatureEntity.signing_capacities[`${index}`] || selectedSignatureEntity.signing_capacities[`${index}`].placeholder_id === null) {
      if (placeholderCount === 2) {
        placeholderCount = 1
        _.set(signature_entity, `signing_capacities[${index}].placeholder_id`, null)
        _.set(signature_entity, `signing_capacities[${index === 0 ? 1 : 0}].placeholder_id`, this.props.numberOfPlaceholderSigners + 1)
      } else {
        placeholderCount = 0
        _.set(signature_entity, `signing_capacities[${index}].placeholder_id`, null)
      }
    }

    this.setState({
      placeholderCount,
      block_collection
    }, () => {
      if (deleteSigner) {
        this.removeSigningCapacityUpdate(index)
      }
    })
  }

  setAttribute(key, value) {
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signature_entity = block_collection.block.signature_entity

    _.set(signature_entity, key, value)
    this.setState({ block_collection })
  }

  updateVotingInterest(votingInterest) {
    const blockCollection = _.cloneDeep(this.state.block_collection)
    _.remove(blockCollection.block.voting_interests, { voting_interest_group_id: votingInterest.voting_interest_group_id })
    votingInterest._destroy = votingInterest.number_of_shares === undefined // weirdness for Rails nested attributes
    blockCollection.block.voting_interests.push(votingInterest)
    this.setState({ block_collection: blockCollection })
  }

  getModalBody() {
    const { votingInterestGroups, votingInterestGroupsLoading } = this.props
    const { signature_entity } = this.state.block_collection.block
    switch (this.state.selectedStage) {
      case STAGES[0]:
        return <EntityInformation
                 entityName={signature_entity.name}
                 descendants={signature_entity.descendants}
                 numberOfPlaceholderSigners={this.props.numberOfPlaceholderSigners}
                 signingCapacities={signature_entity.signing_capacities}
                 nameAlerts={this.state.nameAlerts}
                 signerAlerts={this.state.signerAlerts}
                 isEditing={this.props.selectedSignatureEntity !== null}
                 formSubmitted={this.state.formSubmitted}
                 addDescendant={this.addDescendant}
                 removeDescendant={this.removeDescendant}
                 addSigningCapacity={this.addSigningCapacity}
                 removeSigningCapacity={this.removeSigningCapacity}
                 setAttribute={this.setAttribute}
                 addPlaceholder={this.addPlaceholder}
                 subtractPlaceholder={this.subtractPlaceholder}
               />
      case STAGES[1]:
        return  <AddressInformation
                  address={signature_entity.primary_address}
                  copyToAddress={signature_entity.copy_to_address}
                  setAttribute={this.setAttribute}
                />
      case STAGES[2]:
        return  <SetupVotingInterests
                  setAttribute={this.setAttribute}
                  votingInterestGroups={votingInterestGroups}
                  votingInterestGroupsLoading={votingInterestGroupsLoading}
                  votingInterests={this.state.block_collection.block.voting_interests}
                  updateVotingInterest={this.updateVotingInterest}
                />
    }
  }

  render() {
    const { selectedSignatureEntity } = this.props
    const { showForm } = this.props
    const { selectedStage } = this.state
    const primaryButton = selectedStage === _.last(STAGES) ?
      <Button
        type='primary'
        text={<FormattedMessage id='buttons.save' />}
        onClick={this.submitForm}
      />
    :
      <Button
        type='primary'
        text={<FormattedMessage id='buttons.next' />}
        onClick={this.formValidations}
      />

    return (
      <Modal
        size='700'
        showModal={showForm}
        hideModal={this.hideModal}
        content={
          <div>
            <ModalHeader>
              {selectedSignatureEntity ?
                <FormattedMessage id='signature_management.signer_forms.edit_entity' />
                :
                <FormattedMessage id='signature_management.signer_forms.add_new_entity' />
              }
            </ModalHeader>
            <ModalBody>
              {this.getModalBody()}
            </ModalBody>
            <ModalFooter style={styles.footer}>
              <Button
                type='secondary'
                onClick={this.hideModal}
                text={<FormattedMessage id='buttons.cancel' />}
              />
              <div style={styles.buttons}>
                {selectedStage !== _.first(STAGES) ?
                  <div style={styles.backButton}>
                    <Button
                      type='primary'
                      text={<FormattedMessage id='buttons.back' />}
                      onClick={this.onBack}
                    />
                  </div>
                  :
                  null
                }
                {primaryButton}
              </div>
            </ModalFooter>
          </div>
        }
      />
    )
  }
}

const styles = {
  buttons: {
    display: 'flex'
  },
  backButton: {
    marginRight: '1.2rem'
  },
  footer: {
    padding: '0'
  }
}

EntityForm.defaultProps = {
  realSelectedBlock: null,
  selectedBlock: null,
  selectedSignatureEntity: null
}

EntityForm.propTypes = {
  hasVotingThreshold: PropTypes.bool.isRequired,
  numberOfPlaceholderSigners: PropTypes.number.isRequired,
  realSelectedBlock: PropTypes.object,
  selectedBlock: PropTypes.object,
  selectedSignatureEntity: PropTypes.object,
  showForm: PropTypes.bool.isRequired,
  votingInterestGroups: PropTypes.array.isRequired,
  votingInterestGroupsLoading: PropTypes.bool.isRequired,

  checkForExistingSigner: PropTypes.func.isRequired,
  createBlockCollection: PropTypes.func.isRequired,
  setSelectedForm: PropTypes.func.isRequired,
  updateSignatureEntity: PropTypes.func.isRequired
}

export default EntityForm

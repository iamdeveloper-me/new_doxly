import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'components/Whiteout/Modal/index.jsx'
import SetupVotingInterests from 'components/SignatureGroups/SigningCapacityForms/SetupVotingInterests/index.jsx'
import SignerInformation from './SignerInformation/index.jsx'

let STAGES = ['signer_information', 'voting_interests']

class IndividualForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedStage: null,
      alerts: {},
      formSubmitted: false,
      block_collection: {
        block: {
          signing_capacity: {
            first_name: '',
            last_name: '',
            use_placeholder_name: false,
            placeholder_id: null,
            user: {
              email: ''
            },
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
    this.onSubmit = _.debounce(this.onSubmit.bind(this), 250)
    this.getModalBody = this.getModalBody.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
    this.formValidations = this.formValidations.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onNext = this.onNext.bind(this)
    this.updateVotingInterest = this.updateVotingInterest.bind(this)
    this.addPlaceholder = this.addPlaceholder.bind(this)
    this.subtractPlaceholder = this.subtractPlaceholder.bind(this)
    STAGES = this.props.hasVotingThreshold ? STAGES : [_.first(STAGES)]
  }

  componentDidMount() {
    const { selectedSigningCapacity } = this.props
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signing_capacity = block_collection.block.signing_capacity

    if (selectedSigningCapacity !== null) {
      selectedSigningCapacity['primary_address'] = selectedSigningCapacity.primary_address || signing_capacity.primary_address
      selectedSigningCapacity['copy_to_address'] = selectedSigningCapacity.copy_to_address && (selectedSigningCapacity.copy_to_address.use_copy_to === undefined || selectedSigningCapacity.copy_to_address.use_copy_to) ? _.assign(selectedSigningCapacity.copy_to_address, { 'use_copy_to': true }) : signing_capacity.copy_to_address
      _.assign(signing_capacity, selectedSigningCapacity)

      this.setState({
        selectedStage: _.first(STAGES),
        block_collection
      })
    } else {
      this.setState({
        selectedStage: _.first(STAGES)
      })
    }
  }

  hideModal() {
    this.props.setSelectedForm(null)
  }

  onBack() {
    this.setState({
      selectedStage: STAGES[_.indexOf(STAGES, this.state.selectedStage)-1]
    })
  }

  onNext() {
    if (_.isEmpty(this.state.alerts)) {
      this.setState({
        selectedStage: STAGES[_.indexOf(STAGES, this.state.selectedStage)+1],
        formSubmitted: false
      })
    }
  }

  onSubmit(updateExistingSigners=false) {
    const { selectedSigningCapacity } = this.props
    const { block_collection } = this.state

    if (selectedSigningCapacity !== null) {
      this.props.updateSigningCapacity(block_collection.block, selectedSigningCapacity)
    } else {
      this.props.createBlockCollection(block_collection, updateExistingSigners)
    }
  }

  isValidField(field) {
    return _.trim(field) !== ''
  }

  formValidations() {
    const { signing_capacity } = this.state.block_collection.block
    const emailValidation = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/
    const alerts = _.pickBy(_.cloneDeep(this.state.alerts, _.identify))
    const previousAlerts = !_.isEmpty(alerts)

    if ((previousAlerts && _.isEmpty(_.omit(alerts, ['existing_signer', 'existing_signer_has_sent_packets']))) || (this.props.hasVotingThreshold && this.state.selectedStage === _.last(STAGES))) {
      let nameAlerts = {}
      nameAlerts['blank_signer_name'] = !signing_capacity.use_placeholder_name ? !(this.isValidField(signing_capacity.first_name) && this.isValidField(signing_capacity.last_name)) : false
      nameAlerts['invalid_email'] = this.isValidField(_.trim(signing_capacity.user.email)) ? !emailValidation.test(signing_capacity.user.email.toLowerCase()) : false

      if (_.isEmpty(_.pickBy(nameAlerts, _.identify))) {
        this.setState({
          alerts: {}
        }, () => {
          this.state.selectedStage === _.last(STAGES) ? this.onSubmit(true) : this.onNext()
        })
      } else {
        this.checkAlerts()
      }
    } else {
      this.checkAlerts()
    }
  }

  checkAlerts() {
    const { signing_capacity } = this.state.block_collection.block
    const existingSigner = this.isValidField(signing_capacity.user.email) ? this.props.checkForExistingSigner(signing_capacity) : null
    const emailValidation = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/
    const email = _.trim(signing_capacity.user.email).toLowerCase()

    let alerts = {}
    alerts['blank_signer_name'] = !signing_capacity.use_placeholder_name ? !(this.isValidField(signing_capacity.first_name) && this.isValidField(signing_capacity.last_name)) : false
    alerts['invalid_email'] = this.isValidField(email) ? !emailValidation.test(email) : false
    alerts['has_sent_packets'] = this.props.selectedSigningCapacity !== null && signing_capacity.has_sent_packets
    alerts['existing_signer'] = existingSigner || null
    alerts['existing_signer_has_sent_packets'] = existingSigner ? existingSigner.has_sent_packets : false

    if (_.isEmpty(_.pickBy(alerts, _.identify))) {
      this.setState({
        alerts: {}
      }, () => {
        this.state.selectedStage === _.last(STAGES) ? this.onSubmit() : this.onNext()
      })
    } else {
      this.setState({ alerts: alerts, formSubmitted: true })
    }
  }

  addPlaceholder() {
    const { selectedSigningCapacity } = this.props
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signing_capacity = block_collection.block.signing_capacity
    _.set(signing_capacity, `use_placeholder_name`, true)

    if (selectedSigningCapacity === null || selectedSigningCapacity.placeholder_id === null) {
      _.set(signing_capacity, 'placeholder_id', this.props.numberOfPlaceholderSigners + 1)
    }

    this.setState({
      block_collection
    })
  }

  subtractPlaceholder() {
    const { selectedSigningCapacity } = this.props
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signing_capacity = block_collection.block.signing_capacity
    _.set(signing_capacity, `use_placeholder_name`, false)

    if (selectedSigningCapacity === null || selectedSigningCapacity.placeholder_id === null) {
      _.set(signing_capacity, `placeholder_id`, null)
    }

    this.setState({
      block_collection
    })
  }

  setAttribute(key, value) {
    let block_collection = _.cloneDeep(this.state.block_collection)
    let signing_capacity = block_collection.block.signing_capacity

    _.set(signing_capacity, key, value)
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
    const { selectedSigningCapacity, votingInterestGroups, votingInterestGroupsLoading } = this.props
    const { alerts, block_collection, formSubmitted } = this.state

    switch (this.state.selectedStage) {
      case STAGES[0]:
        return <SignerInformation
                 alerts={alerts}
                 formSubmitted={formSubmitted}
                 isEditing={selectedSigningCapacity !== null}
                 signingCapacity={block_collection.block.signing_capacity}
                 setAttribute={this.setAttribute}
                 addPlaceholder={this.addPlaceholder}
                 subtractPlaceholder={this.subtractPlaceholder}
               />
      case STAGES[1]:
        return <SetupVotingInterests
                 setAttribute={this.setAttribute}
                 votingInterestGroups={votingInterestGroups}
                 votingInterestGroupsLoading={votingInterestGroupsLoading}
                 votingInterests={block_collection.block.voting_interests}
                 updateVotingInterest={this.updateVotingInterest}
               />
    }
  }

  render() {
    const { selectedSigningCapacity } = this.props
    const { showForm } = this.props
    const { selectedStage } = this.state
    const primaryButton = selectedStage === _.last(STAGES) ?
      <Button
        type='primary'
        text={<FormattedMessage id='buttons.save' />}
        onClick={this.formValidations}
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
              {selectedSigningCapacity ?
                <FormattedMessage id='signature_management.signer_forms.edit_individual' />
                :
                <FormattedMessage id='signature_management.signer_forms.add_new_individual' />
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

IndividualForm.defaultProps = {
  realSelectedBlock: null,
  selectedBlock: null,
  selectedSigningCapacity: null
}

IndividualForm.propTypes = {
  hasVotingThreshold: PropTypes.bool.isRequired,
  numberOfPlaceholderSigners: PropTypes.number.isRequired,
  realSelectedBlock: PropTypes.object,
  selectedBlock: PropTypes.object,
  selectedSigningCapacity: PropTypes.object,
  showForm: PropTypes.bool.isRequired,
  signingCapacities: PropTypes.object.isRequired,
  votingInterestGroups: PropTypes.array.isRequired,
  votingInterestGroupsLoading: PropTypes.bool.isRequired,

  checkForExistingSigner: PropTypes.func.isRequired,
  createBlockCollection: PropTypes.func.isRequired,
  setSelectedForm: PropTypes.func.isRequired,
  updateSigningCapacity: PropTypes.func.isRequired
}

export default IndividualForm

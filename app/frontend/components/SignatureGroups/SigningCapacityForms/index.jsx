import PropTypes from 'prop-types'
import React from 'react'

import EntityForm from './EntityForm/index.jsx'
import IndividualForm from './IndividualForm/index.jsx'
import { SIGNING_CAPACITY_FORMS } from 'components/SignatureGroups/index.jsx'

class SigningCapacityForms extends React.PureComponent {
  render() {
    const { hasVotingThreshold, numberOfPlaceholderSigners, realSelectedBlock, selectedBlock, selectedForm, showForm, signingCapacities, votingInterestGroups, votingInterestGroupsLoading } = this.props
    const { checkForExistingSigner, createBlockCollection, setSelectedFormAndGroup, updateSignatureEntity, updateSigningCapacity } = this.props

    switch (selectedForm) {
      case SIGNING_CAPACITY_FORMS.individual_form:
        return  <IndividualForm
                  showForm={showForm}
                  selectedSigningCapacity={selectedBlock}
                  numberOfPlaceholderSigners={numberOfPlaceholderSigners}
                  signingCapacities={signingCapacities}
                  createBlockCollection={createBlockCollection}
                  checkForExistingSigner={checkForExistingSigner}
                  setSelectedForm={setSelectedFormAndGroup}
                  updateSigningCapacity={updateSigningCapacity}
                  hasVotingThreshold={hasVotingThreshold}
                  votingInterestGroups={votingInterestGroups}
                  votingInterestGroupsLoading={votingInterestGroupsLoading}
                  realSelectedBlock={realSelectedBlock}
                  selectedBlock={selectedBlock}
                />
      case SIGNING_CAPACITY_FORMS.entity_form:
        return  <EntityForm
                  showForm={showForm}
                  selectedSignatureEntity={selectedBlock}
                  numberOfPlaceholderSigners={numberOfPlaceholderSigners}
                  checkForExistingSigner={checkForExistingSigner}
                  createBlockCollection={createBlockCollection}
                  setSelectedForm={setSelectedFormAndGroup}
                  updateSignatureEntity={updateSignatureEntity}
                  hasVotingThreshold={hasVotingThreshold}
                  votingInterestGroups={votingInterestGroups}
                  votingInterestGroupsLoading={votingInterestGroupsLoading}
                  realSelectedBlock={realSelectedBlock}
                  selectedBlock={selectedBlock}
                />
      default:
        return null
    }
  }
}

SigningCapacityForms.defaultProps = {
  realSelectedBlock: null,
  selectedBlock: null,
  selectedForm: null
}

SigningCapacityForms.propTypes = {
  hasVotingThreshold: PropTypes.bool.isRequired,
  numberOfPlaceholderSigners: PropTypes.number.isRequired,
  selectedBlock: PropTypes.object,
  selectedForm: PropTypes.object,
  showForm: PropTypes.bool.isRequired,
  realSelectedBlock: PropTypes.object,
  signingCapacities: PropTypes.object.isRequired,
  votingInterestGroups: PropTypes.array.isRequired,
  votingInterestGroupsLoading: PropTypes.bool.isRequired,

  checkForExistingSigner: PropTypes.func.isRequired,
  createBlockCollection: PropTypes.func.isRequired,
  setSelectedFormAndGroup: PropTypes.func.isRequired,
  updateSignatureEntity: PropTypes.func.isRequired,
  updateSigningCapacity: PropTypes.func.isRequired
}

export default SigningCapacityForms

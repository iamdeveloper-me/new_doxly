import { normalize, schema } from 'normalizr'
import React from 'react'

import Api from 'helpers/Api'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import VotingThresholdsTable from './VotingThresholdsTable/index.jsx'
import { FormattedMessage } from 'react-intl';

export default class VotingThreshold extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      documents: {},
      votingInterestGroups: {},
      votingInterestThresholds: {},
      documentsLoading: true,
      votingInterestGroupsLoading: true
    }
    this.fetchData = this.fetchData.bind(this)
    this.addVotingInterestGroup = this.addVotingInterestGroup.bind(this)
    this.createVotingInterestGroup = this.createVotingInterestGroup.bind(this)
    this.updateVotingInterestGroup = this.updateVotingInterestGroup.bind(this)
    this.deleteVotingInterestGroup = this.deleteVotingInterestGroup.bind(this)
    this.createVotingInterestThreshold = this.createVotingInterestThreshold.bind(this)
    this.updateVotingInterestThreshold = this.updateVotingInterestThreshold.bind(this)
    this.deleteVotingInterestThreshold = this.deleteVotingInterestThreshold.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const params = Params.fetch()
    Api.get(Routes.dealDocumentsRequiringThreshold(params.deals))
      .then((documents) => {
        this.normalizeDocuments(documents)
      })
      .catch(error => ErrorHandling.setErrors(error))

    Api.get(Routes.dealVotingInterestGroups(params.deals, ['voting_interest_thresholds']))
      .then((votingInterestGroups) => {
        this.normalizeVotingInterestGroups(votingInterestGroups)
      })
      .catch(error => ErrorHandling.setErrors(error))
  }

  normalizeDocuments(documents) {
    // schemas must be defined because they can be used, so we have to define them in the opposite order from when they will appear
    const normalizedData = normalize(documents, [ document ])
    const updatedState = _.merge({}, this.state, normalizedData.entities, { documentsLoading: false })
    this.setState(updatedState)
  }

  normalizeVotingInterestGroups(votingInterestGroups) {
    // schemas must be defined because they can be used, so we have to define them in the opposite order from when they will appear
    const normalizedData = normalize(votingInterestGroups, [ votingInterestGroup ])
    const updatedState = _.merge({}, this.state, normalizedData.entities, { votingInterestGroupsLoading: false })
    this.setState(updatedState)
  }

  addVotingInterestGroup() {
    let votingInterestGroups = _.cloneDeep(this.state.votingInterestGroups)
    votingInterestGroups['new'] = {
      name: '',
      total_number_of_shares: 0,
      voting_interest_thresholds: []
    }
    this.setState({ votingInterestGroups })
  }

  createVotingInterestGroup(votingInterestGroup) {
    const params = Params.fetch()
    Api.post(Routes.dealVotingInterestGroups(params.deals, ['voting_interest_thresholds']), votingInterestGroup)
       .then(votingInterestGroup => {
          // update groups
          let votingInterestGroups = _.cloneDeep(this.state.votingInterestGroups)
          votingInterestGroups[votingInterestGroup.id] = votingInterestGroup
          delete votingInterestGroups['new']

          this.setState({ votingInterestGroups })
       })
       .catch(error => ErrorHandling.setErrors(error))
  }

  updateVotingInterestGroup(votingInterestGroup) {
    const params = Params.fetch()
    Api.put(Routes.dealVotingInterestGroup(params.deals, votingInterestGroup.id, ['voting_interest_thresholds']), votingInterestGroup)
       .then(votingInterestGroup => {
          // update groups
          let votingInterestGroups = _.cloneDeep(this.state.votingInterestGroups)
          votingInterestGroups[votingInterestGroup.id] = votingInterestGroup

          this.setState({ votingInterestGroups })
       })
       .catch(error => ErrorHandling.setErrors(error))
  }

  deleteVotingInterestGroup(votingInterestGroup) {
    const params = Params.fetch()
    Api.delete(Routes.dealVotingInterestGroup(params.deals, votingInterestGroup.id))
       .then(() => {
          // update groups
          let votingInterestGroups = _.cloneDeep(this.state.votingInterestGroups)
          delete votingInterestGroups[votingInterestGroup.id]

          this.setState({ votingInterestGroups })
       })
       .catch(error => ErrorHandling.setErrors(error))
  }

  createVotingInterestThreshold(votingInterestThreshold) {
    const params = Params.fetch()
    Api.post(Routes.dealVotingInterestGroupVotingInterestThresholds(params.deals, votingInterestThreshold.voting_interest_group_id), votingInterestThreshold)
       .then(votingInterestThreshold => {
          // update thresholds
          let votingInterestThresholds = _.cloneDeep(this.state.votingInterestThresholds)
          votingInterestThresholds[votingInterestThreshold.id] = votingInterestThreshold
          
          // update groups
          let votingInterestGroups = _.cloneDeep(this.state.votingInterestGroups)
          votingInterestGroups[votingInterestThreshold.voting_interest_group_id].voting_interest_thresholds.push(votingInterestThreshold.id)

          this.setState({ votingInterestThresholds, votingInterestGroups })
       })
       .catch(error => ErrorHandling.setErrors(error))
  }

  updateVotingInterestThreshold(votingInterestThreshold) {
    const params = Params.fetch()
    Api.put(Routes.dealVotingInterestGroupVotingInterestThreshold(params.deals, votingInterestThreshold.voting_interest_group_id, votingInterestThreshold.id), votingInterestThreshold)
       .then(votingInterestThreshold => {
          // update thresholds
          let votingInterestThresholds = _.cloneDeep(this.state.votingInterestThresholds)
          votingInterestThresholds[votingInterestThreshold.id] = votingInterestThreshold

          this.setState({ votingInterestThresholds })
       })
       .catch(error => ErrorHandling.setErrors(error))
  }

  deleteVotingInterestThreshold(votingInterestThreshold) {
    const params = Params.fetch()
    Api.delete(Routes.dealVotingInterestGroupVotingInterestThreshold(params.deals, votingInterestThreshold.voting_interest_group_id, votingInterestThreshold.id))
       .then(() => {
          // update thresholds
          let votingInterestThresholds = _.cloneDeep(this.state.votingInterestThresholds)
          delete votingInterestThresholds[votingInterestThreshold.id]

          this.setState({ votingInterestThresholds })
       })
       .catch(error => ErrorHandling.setErrors(error))
  }

  render() {
    const { documentsLoading, votingInterestGroupsLoading } = this.state
    if (documentsLoading || votingInterestGroupsLoading) {
      return (
        <div style={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      )
    }

    return (
      <div style={styles.container} className='whiteout-ui'>
        <div style={styles.instructions}>
          <FormattedMessage id='signature_management.voting_threshold.instructions' />
        </div>
        <VotingThresholdsTable
          documents={this.state.documents}
          votingInterestGroups={this.state.votingInterestGroups}
          votingInterestThresholds={this.state.votingInterestThresholds}
          addVotingInterestGroup={this.addVotingInterestGroup}
          createVotingInterestGroup={this.createVotingInterestGroup}
          updateVotingInterestGroup={this.updateVotingInterestGroup}
          deleteVotingInterestGroup={this.deleteVotingInterestGroup}
          createVotingInterestThreshold={this.createVotingInterestThreshold}
          updateVotingInterestThreshold={this.updateVotingInterestThreshold}
          deleteVotingInterestThreshold={this.deleteVotingInterestThreshold}
        />
      </div>
    )
  }

}

const document = new schema.Entity('documents')
const votingInterestThreshold = new schema.Entity('votingInterestThresholds')
const votingInterestGroup = new schema.Entity('votingInterestGroups', {
  voting_interest_thresholds: [ votingInterestThreshold ]
})

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  instructions: {
    margin: '2.4rem 10% 1.6rem 10%',
    textAlign: 'center'
  },
  loadingContainer: {
    margin: '12.5rem'
  }
}

import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'

export default class SetupVotingInterests extends React.Component {

  constructor(props) {
    super(props)
    this.setNumberOfShares = this.setNumberOfShares.bind(this)
  }

  setNumberOfShares(votingInterest, numberOfShares) {
    votingInterest.number_of_shares = numberOfShares
    this.props.updateVotingInterest(votingInterest)
  }
  
  render() {
    const { votingInterestGroups, votingInterestGroupsLoading, votingInterests } = this.props
    if (votingInterestGroupsLoading) {
      return <LoadingSpinner showLoadingBox={false} />
    }

    const params = Params.fetch()
    const instructions = (
      <div style={styles.instructions}>
        <i className='mdi mdi-vote' style={styles.emptyIcon} />
        <br />
        <br />
        <h3><FormattedMessage id='signature_management.voting_threshold.voting_interests.empty.no_voting_interest_groups' /></h3>
        <br />
        <br />
        <p>
          <FormattedMessage
            id='signature_management.voting_threshold.voting_interests.empty.visit_voting_threshold_tab'
            values={{
              link: <b><a href={`/deals/${params.deals}/voting_threshold`}><FormattedMessage id='signature_management.voting_threshold.voting_threshold_tab' /></a></b>
            }}
          />
        </p>
        <br />
        <p><FormattedMessage id='signature_management.voting_threshold.voting_interests.empty.can_change_later' /></p>
      </div>
    )

    const votingInterestGroupsList = (
      <div style={styles.container}>
        <div style={styles.description}>
          <FormattedMessage id='signature_management.voting_threshold.voting_interests.voting_interest_description' />
        </div>
        <div style={styles.votingInterestHeader}>
          <div style={styles.votingInterestGroupName}>
            <h4>
              <FormattedMessage id='signature_management.voting_threshold.voting_interest_group' />
            </h4>
          </div>
          <div style={styles.votingInterestNumberOfShares}>
            <h4>
            <FormattedMessage id='signature_management.voting_threshold.voting_interests.number_of_shares' />
            </h4>
          </div>
        </div>
        {
          _.map(votingInterestGroups, votingInterestGroup => {
            const votingInterest = _.find(votingInterests, { voting_interest_group_id: votingInterestGroup.id }) || { voting_interest_group_id: votingInterestGroup.id }
            return (
              <div style={styles.votingInterest} key={votingInterestGroup.id}>
                <div style={styles.votingInterestGroupName}>{votingInterestGroup.name}</div>
                <div style={styles.votingInterestNumberOfShares}>
                  <NumberFormat
                    value={votingInterest.number_of_shares}
                    displayType='input'
                    customInput={Input}
                    thousandSeparator={true}
                    includeMargin={false}
                    placeholder='0'
                    onValueChange={values => this.setNumberOfShares(votingInterest, values.floatValue)}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    )

    return votingInterestGroups.length > 0 ? votingInterestGroupsList : instructions
  }
}

const styles = {
  instructions: {
    padding: '3.2rem',
    textAlign: 'center',
    margin: 'auto'
  },
  emptyIcon: {
    fontSize: '6.4rem',
    color: Colors.whiteout.text.primary
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  description: {
    textAlign: 'center',
    padding: '2.4rem'
  },
  votingInterestHeader: {
    display: 'flex',
    padding: '0.8rem 0',
    width: '48rem',
    alignItems: 'center'
  },
  votingInterest: {
    display: 'flex',
    padding: '0.8rem 0',
    width: '48rem',
    alignItems: 'center',
    borderTop: `0.1rem solid ${Colors.whiteout.mediumGray}`
  },
  votingInterestGroupName: {
    flexGrow: '1',
    paddingRight: '1.6rem'
  },
  votingInterestNumberOfShares: {
    flexShrink: '0',
    width: '18rem'
  }
}

SetupVotingInterests.propTypes = {
  votingInterestGroups: PropTypes.array.isRequired,
  votingInterestGroupsLoading: PropTypes.bool.isRequired,
  votingInterests: PropTypes.array.isRequired,

  updateVotingInterest: PropTypes.func.isRequired
}

import PropTypes from 'prop-types'
import React from 'react'

import EditableNumber from 'components/EditableNumber/index.jsx';

export default class VotingInterestGroupTotalNumberOfShares extends React.PureComponent {

  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save(value) {
    let votingInterestGroup = _.cloneDeep(this.props.votingInterestGroup)
    votingInterestGroup.total_number_of_shares = Math.round(value)
    this.props.updateVotingInterestGroup(votingInterestGroup)
  }

  verifyIsValid(values) {
    return values.floatValue >= 0 && values.floatValue <= 10000000000 && parseInt(values.floatValue) === values.floatValue
  }

  render() {
    const { votingInterestGroup } = this.props
    return (
      <div style={styles.container}>
        <EditableNumber
          value={`${votingInterestGroup.total_number_of_shares}`}
          handleSubmit={this.save}
          verifyIsValid={this.verifyIsValid}
          disabled={!_.has(votingInterestGroup, 'id')}
          numberFormatProps={
            {
              thousandSeparator: true
            }
          }
        />
      </div>
    )
  }

}

const styles = {
  container: {
    overflow: 'auto',
    padding: '0.8rem'
  }
}

VotingInterestGroupTotalNumberOfShares.propTypes = {
  votingInterestGroup: PropTypes.object.isRequired,

  updateVotingInterestGroup: PropTypes.func.isRequired
}
import PropTypes from 'prop-types'
import React from 'react'

import EditableNumber from 'components/EditableNumber/index.jsx';

export default class VotingInterestThreshold extends React.PureComponent {

  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
  }

  roundToTwoDecimalPlaces(value) {
    return Math.round(value * 100) / 100
  }

  convertPercentToDecimal(value) {
    return value / 100
  }

  save(value) {
    const { votingInterestThreshold } = this.props
    const { createVotingInterestThreshold, deleteVotingInterestThreshold, updateVotingInterestThreshold } = this.props
    const threshold = this.convertPercentToDecimal(this.roundToTwoDecimalPlaces(parseFloat(value)))
    const thresholdIsValid = !isNaN(threshold) && threshold > 0 && threshold <= 1
    const votingInterestThresholdExists = votingInterestThreshold.threshold !== 0
    let updatedVotingInterestThreshold = _.cloneDeep(votingInterestThreshold)
    updatedVotingInterestThreshold.threshold = threshold
    
    if (thresholdIsValid) {
      if (votingInterestThresholdExists) {
        // only update if it changed
        if (threshold !== votingInterestThreshold.threshold) {
          updateVotingInterestThreshold(updatedVotingInterestThreshold)
        }
      } else {
        createVotingInterestThreshold(updatedVotingInterestThreshold)
      }
    } else {
      if (votingInterestThresholdExists) {
        deleteVotingInterestThreshold(updatedVotingInterestThreshold)
      }
    }
  }

  verifyIsValid(values) {
    return (values.value === '') || (values.floatValue >= 0 && values.floatValue <= 100)
  }

  render() {
    const { votingInterestGroup, votingInterestThreshold } = this.props
    let threshold = null
    if (votingInterestThreshold.threshold > 0) {
      threshold = `${this.roundToTwoDecimalPlaces(votingInterestThreshold.threshold*100)}`
    }

    return (
      <div style={styles.container}>
        <EditableNumber
          value={threshold}
          placeholder='-'
          handleSubmit={this.save}
          verifyIsValid={this.verifyIsValid}
          disabled={!_.has(votingInterestGroup, 'id')}
          numberFormatProps={
            {
              thousandSeparator: true,
              suffix: '%'
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

VotingInterestThreshold.propTypes = {
  votingInterestGroup: PropTypes.object.isRequired,
  votingInterestThreshold: PropTypes.object.isRequired,

  createVotingInterestThreshold: PropTypes.func.isRequired,
  deleteVotingInterestThreshold: PropTypes.func.isRequired,
  updateVotingInterestThreshold: PropTypes.func.isRequired
}
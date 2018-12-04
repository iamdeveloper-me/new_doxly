import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import EditableText from 'components/EditableText/index.jsx'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
 } from 'components/Whiteout/Tooltipster/index.jsx'

export default class VotingInterestGroupName extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      deleteTooltipIsOpen: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.openDeleteTooltip = this.openDeleteTooltip.bind(this)
    this.closeDeleteTooltip = this.closeDeleteTooltip.bind(this)
    this.deleteVotingInterestGroup = this.deleteVotingInterestGroup.bind(this)
    this.save = this.save.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({ isHovering: true })
  }

  onMouseLeaveHandler() {
    this.setState({ isHovering: false })
  }

  openDeleteTooltip() {
    this.setState({ deleteTooltipIsOpen: true })
  }

  closeDeleteTooltip() {
    this.setState({ deleteTooltipIsOpen: false })
  }

  deleteVotingInterestGroup() {
    this.closeDeleteTooltip()
    this.props.deleteVotingInterestGroup(this.props.votingInterestGroup)
  }

  save(value) {
    let votingInterestGroup = _.cloneDeep(this.props.votingInterestGroup)
    votingInterestGroup.name = value

    const votingInterestGroupExists = _.has(votingInterestGroup, 'id')
    if (votingInterestGroupExists) {
      this.props.updateVotingInterestGroup(votingInterestGroup)
    } else {
      this.props.createVotingInterestGroup(votingInterestGroup)
    }
  }

  verifyIsValid(value) {
    return !_.isEmpty(value)
  }

  render() {
    const { votingInterestGroup } = this.props

    const deleteButton = _.has(votingInterestGroup, 'id') ?
      <div style={styles.delete}>
        <Tooltipster
          open={this.state.deleteTooltipIsOpen}
          triggerElement={
            <div onClick={this.openDeleteTooltip}>
              <i style={styles.deleteIcon} className='mdi mdi-delete'></i>
            </div>
          }
          content={
            <TooltipsterBody>
              <TooltipsterHeader>
                <p><FormattedMessage id='signature_management.voting_threshold.delete_voting_interest_group' /></p>
              </TooltipsterHeader>
              <TooltipsterText>
                <p className="gray"><FormattedMessage id='signature_management.voting_threshold.delete_voting_interest_group_description' /></p>
              </TooltipsterText>
              <TooltipsterButtons>
                <Button size='small' type='secondary' text={<FormattedMessage id='buttons.cancel' />} onClick={this.closeDeleteTooltip} />
                <Button size='small' type='removal' text={<FormattedMessage id='buttons.delete' />} icon='delete' onClick={this.deleteVotingInterestGroup} />
              </TooltipsterButtons>
            </TooltipsterBody>
          }
          interactive={true}
          repositionsOnScroll={true}
          side='bottom'
          theme='tooltipster-doxly-whiteout'
          onClickOutside={this.closeDeleteTooltip}
        />
      </div>
    :
      null
    
    return (
      <div
        style={styles.container}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <EditableText
          defaultIsEditing={_.isEmpty(votingInterestGroup.name)}
          value={votingInterestGroup.name}
          handleSubmit={this.save}
          showLabel={false}
          verifyIsValid={this.verifyIsValid}
        />
        {this.state.isHovering || this.state.deleteTooltipIsOpen ? deleteButton : null}
      </div>
    )
  }

}

const styles = {
  container: {
    overflow: 'auto',
    padding: '2.4rem 0.8rem',
    minHeight: '7.6rem',
    height: '100%',
    width: '12.8rem'
  },
  delete: {
    position: 'absolute',
    top: '0',
    right: '0',
    padding: '0.8rem'
  },
  deleteIcon: {
    color: Colors.whiteout.carmine,
    cursor: 'pointer'
  }
}

VotingInterestGroupName.propTypes = {
  votingInterestGroup: PropTypes.object.isRequired,

  createVotingInterestGroup: PropTypes.func.isRequired,
  deleteVotingInterestGroup: PropTypes.func.isRequired,
  updateVotingInterestGroup: PropTypes.func.isRequired
}
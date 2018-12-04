import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import {
  Tooltip,
  TooltipBody,
  TooltipButtons,
  TooltipHeader,
  TooltipText
} from 'components/Whiteout/Tooltip/index.jsx'

class RecoveryCodes extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      alertShown: false
    }
    this.showAlertTooltip = this.showAlertTooltip.bind(this)
    this.hideAlertTooltip = this.hideAlertTooltip.bind(this)
    this.regenerateRecoveryCodes = this.regenerateRecoveryCodes.bind(this)
  }

  showAlertTooltip() {
    this.setState({ alertShown: true })
  }

  hideAlertTooltip() {
    this.setState({ alertShown: false })
  }

  regenerateRecoveryCodes() {
    this.props.regenerateRecoveryCodes()
    this.hideAlertTooltip()
  }

  render() {
    const { intl } = this.props
    const { regenerateRecoveryCodes } = this.props

    return (
      <div>
        <div className="gray" style={styles.header}><FormattedMessage id='account_settings.two_factor_authentication.status.recovery_codes.recovery_codes' /></div>
        <Tooltip
          showTooltip={this.state.alertShown}
          hideTooltip={this.hideAlertTooltip}
          position='bottom'
          trigger={
            <Button
              icon="sync"
              size="mini"
              text={<FormattedMessage id='account_settings.two_factor_authentication.status.recovery_codes.regenerate' />}
              type="secondary"
              onClick={this.showAlertTooltip}
            />
          }
          content={
            <div>
              <TooltipBody>
                <TooltipHeader>
                  <p>{intl.formatMessage({ id: 'account_settings.two_factor_authentication.status.are_you_sure' })}</p>
                </TooltipHeader>
                <TooltipText>
                  <p className="gray">{intl.formatMessage({ id: 'account_settings.two_factor_authentication.status.recovery_codes.regenerate_warning' })}</p>
                </TooltipText>
                <TooltipButtons>
                  <Button
                    size='small'
                    type='secondary'
                    text={intl.formatMessage({ id: 'buttons.cancel' })}
                    onClick={this.hideAlertTooltip}
                  />
                  <Button
                    size='small'
                    type='primary'
                    text={intl.formatMessage({ id: 'account_settings.two_factor_authentication.status.recovery_codes.regenerate' })}
                    onClick={this.regenerateRecoveryCodes}
                  />
                </TooltipButtons>
              </TooltipBody>
            </div>
          }
        />
      </div>
    )
  }

}

const styles = {
  header: {
    fontSize: '1.4rem',
    marginBottom: '0.4rem'
  }
}

RecoveryCodes.propTypes = {
  intl: intlShape.isRequired,

  regenerateRecoveryCodes: PropTypes.func.isRequired
}

export default injectIntl(RecoveryCodes)
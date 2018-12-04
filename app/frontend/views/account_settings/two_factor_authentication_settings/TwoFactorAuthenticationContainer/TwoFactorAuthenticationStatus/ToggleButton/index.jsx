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

class ToggleButton extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      alertShown: false
    }
    this.showAlertTooltip = this.showAlertTooltip.bind(this)
    this.hideAlertTooltip = this.hideAlertTooltip.bind(this)
    this.disableTwoFactorAuthentication = this.disableTwoFactorAuthentication.bind(this)
  }

  showAlertTooltip() {
    this.setState({ alertShown: true })
  }

  hideAlertTooltip() {
    this.setState({ alertShown: false })
  }

  disableTwoFactorAuthentication() {
    this.props.disableTwoFactorAuthentication()
    this.hideAlertTooltip()
  }

  render() {
    const { entitiesRequiringTwoFactor, intl, twoFactorEnabled } = this.props
    const { disableTwoFactorAuthentication, toggleSettingUp } = this.props

    if (twoFactorEnabled) {
      return (
        <Tooltip
          showTooltip={this.state.alertShown}
          hideTooltip={this.hideAlertTooltip}
          trigger={
            <Button
              text={<FormattedMessage id='account_settings.two_factor_authentication.status.toggle_button.disable_two_factor_authentication' />}
              type="secondary"
              disabled={entitiesRequiringTwoFactor.length > 0}
              onClick={this.showAlertTooltip}
            />
          }
          position='bottom'
          content={
            <div className="whiteout-ui">
              <TooltipBody>
                <TooltipHeader>
                  <p>{intl.formatMessage({ id: 'account_settings.two_factor_authentication.status.are_you_sure' })}</p>
                </TooltipHeader>
                <TooltipText>
                  <p className="gray">{intl.formatMessage({ id: 'account_settings.two_factor_authentication.status.toggle_button.disable_warning' })}</p>
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
                    type='removal'
                    text={intl.formatMessage({ id: 'account_settings.two_factor_authentication.status.toggle_button.disable' })}
                    onClick={this.disableTwoFactorAuthentication}
                  />
                </TooltipButtons>
              </TooltipBody>
            </div>
          }
        />
      )
    } else {
      return (
        <Button
          text={<FormattedMessage id='account_settings.two_factor_authentication.status.toggle_button.enable_two_factor_authentication' />}
          type="primary"
          onClick={toggleSettingUp}
        />
      )
    }
  }

}

ToggleButton.propTypes = {
  intl: intlShape.isRequired,
  twoFactorEnabled: PropTypes.bool.isRequired,

  disableTwoFactorAuthentication: PropTypes.func.isRequired,
  toggleSettingUp: PropTypes.func.isRequired
}

export default injectIntl(ToggleButton)
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import {
  Tooltip,
  TooltipBody,
  TooltipButtons,
  TooltipHeader,
  TooltipText
} from 'components/Whiteout/Tooltip/index.jsx'
import RecoveryCodes from './RecoveryCodes/index.jsx'
import ToggleButton from './ToggleButton/index.jsx'

class TwoFactorAuthenticationStatus extends React.PureComponent {

  render() {
    const { entitiesRequiringTwoFactor, intl, twoFactorEnabled } = this.props
    const { disableTwoFactorAuthentication, regenerateRecoveryCodes, toggleSettingUp } = this.props

    const status = twoFactorEnabled ? 'enabled' : 'disabled'
    const recoveryCodes = (
      twoFactorEnabled ?
        <RecoveryCodes
          regenerateRecoveryCodes={regenerateRecoveryCodes}
        />
      :
        null
    )

    return (
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.status}>
            <div className="gray" style={styles.header}>Status</div>
            <div style={styles[status]}>
              <i className="mdi mdi-checkbox-blank-circle" style={styles.statusIcon}></i>
              <FormattedMessage id={`account_settings.two_factor_authentication.status.${status}`} />
            </div>
          </div>
          {recoveryCodes}
        </div>
        <div style={styles.right}>
          <ToggleButton
            entitiesRequiringTwoFactor={entitiesRequiringTwoFactor}
            twoFactorEnabled={twoFactorEnabled}
            disableTwoFactorAuthentication={disableTwoFactorAuthentication}
            toggleSettingUp={toggleSettingUp}
          />
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    width: '100%'
  },
  right: {
    flexGrow: '1',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  status: {
    marginBottom: '2.4rem'
  },
  header: {
    fontSize: '1.4rem',
    marginBottom: '0.4rem'
  },
  disabled: {
    color: Colors.whiteout.alert.error,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  enabled: {
    color: Colors.whiteout.alert.complete,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  statusIcon: {
    marginRight: '0.4rem'
  }
}

TwoFactorAuthenticationStatus.propTypes = {
  entitiesRequiringTwoFactor: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  twoFactorEnabled: PropTypes.bool.isRequired,
  
  disableTwoFactorAuthentication: PropTypes.func.isRequired,
  regenerateRecoveryCodes: PropTypes.func.isRequired,
  toggleSettingUp: PropTypes.func.isRequired,
}

export default injectIntl(TwoFactorAuthenticationStatus)
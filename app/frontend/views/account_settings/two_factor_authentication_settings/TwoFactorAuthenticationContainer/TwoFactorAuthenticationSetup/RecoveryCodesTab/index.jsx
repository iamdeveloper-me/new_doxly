import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'components/Whiteout/Alert/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'

export default class RecoveryCodesTab extends React.PureComponent {

  buildRecoveryCodesList(recoveryCodes) {
    const numberOfCodes = recoveryCodes.length
    const numberInFirstColumn = Math.ceil(recoveryCodes.length/2)
    return _.chunk(recoveryCodes, numberInFirstColumn).map((column, i) => (
      <div key={i}>
        {column.map(code => <h3 key={code} style={styles.recoveryCode}>{code}</h3>)}
      </div>
    ))
  }

  render() {
    const { recoveryCodes } = this.props
    const { downloadRecoveryCodes, generateRecoveryCodes } = this.props

    const recoveryCodesList = 
      _.isEmpty(recoveryCodes) ?
        <div style={styles.recoveryCodesContainer}>
          <LoadingSpinner
            showLoadingBox={false}
            loadingText={<FormattedMessage id='account_settings.two_factor_authentication.setup.recovery_codes_tab.generating_codes' />}
          />
        </div>
      :
        <div style={styles.recoveryCodesContainer}>
          <div style={styles.recoveryCodes}>
            {this.buildRecoveryCodesList(recoveryCodes)}
          </div>
          <br />
          <Button
            icon="download"
            type="secondary"
            text={<FormattedMessage id='account_settings.two_factor_authentication.setup.recovery_codes_tab.download_codes' />}
            onClick={downloadRecoveryCodes}
          />
        </div>

    return (
      <div>
        <h2><FormattedMessage id='account_settings.two_factor_authentication.setup.recovery_codes_tab.title' /></h2>
        <br />
        <p><FormattedMessage id='account_settings.two_factor_authentication.setup.recovery_codes_tab.explanation' /></p>
        <br />
        <Alert
          messageTitle={<FormattedMessage id='account_settings.two_factor_authentication.setup.recovery_codes_tab.alert' />}
        />
        {recoveryCodesList}
      </div>
    )
  }

}

const styles = {
  recoveryCodesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3.2rem 1.6rem'
  },
  recoveryCodes: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  recoveryCode: {
    padding: '0.4rem 2.4rem'
  }
}

RecoveryCodesTab.propTypes = {
  recoveryCodes: PropTypes.array.isRequired,

  downloadRecoveryCodes: PropTypes.func.isRequired,
  generateRecoveryCodes: PropTypes.func.isRequired
}
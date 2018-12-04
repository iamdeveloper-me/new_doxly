import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'components/Whiteout/Alert/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Input from 'components/Whiteout/Input/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'

export default class QrCodeTab extends React.PureComponent {

  constructor(props) {
    super(props)
    this.updateToken = this.updateToken.bind(this)
  }

  updateToken(e) {
    const token = e.target.value
    this.props.updateToken(token)
  }

  render() {
    const { qrCode, token, tokenError } = this.props
    const { getQrCode, updateToken, verifyToken } = this.props

    const tokenErrorMessage = (
      tokenError ?
        <div style={styles.errorMessage}>
          <Alert
            status='error'
            messageTitle={<FormattedMessage id='account_settings.two_factor_authentication.setup.qr_code_tab.verify_token.error' />}
          />
        </div>
      :
        null
    )

    const content = (
      qrCode ?
        <div>
          <p className="gray"><FormattedMessage id='account_settings.two_factor_authentication.setup.qr_code_tab.explanation' /></p>
          <br />
          <img style={styles.image} src={qrCode} />
          <br /><br />
          <h3 style={styles.verifyTokenHeader}><FormattedMessage id='account_settings.two_factor_authentication.setup.qr_code_tab.verify_token.title' /></h3>
          <p className="gray"><FormattedMessage id='account_settings.two_factor_authentication.setup.qr_code_tab.verify_token.explanation' /></p>
          <br />
          {tokenErrorMessage}
          <Input
            type="text"
            size="large"
            placeholder="123456"
            value={token}
            onChange={this.updateToken}
            invalid={tokenError}
          />
        </div>
      :
        <div style={styles.loading}>
          <LoadingSpinner
            loadingText={<FormattedMessage id='account_settings.two_factor_authentication.setup.qr_code_tab.loading_message' />}
            showLoadingBox={false}
          />
        </div>
    )

    return (
      <div>
        <h2><FormattedMessage id='account_settings.two_factor_authentication.setup.qr_code_tab.title' /></h2>
        <br />
        {content}
      </div>
    )
  }

}

const styles = {
  image: {
    height: '20rem',
    width: '20rem',
    margin: '0 auto'
  },
  verifyTokenHeader: {
    marginBottom: '0.8rem'
  },
  loading: {
    margin: '3.2rem'
  },
  errorMessage: {
    marginBottom: '0.8rem'
  }
}

QrCodeTab.defaultProps = {
  qrCode: null
}

QrCodeTab.propTypes = {
  qrCode: PropTypes.string,
  token: PropTypes.string.isRequired,
  tokenError: PropTypes.bool.isRequired,

  getQrCode: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired
}
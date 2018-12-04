import _ from 'lodash'
import FileSaver from 'file-saver'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Colors from 'helpers/Colors'
import ErrorHandling from 'helpers/ErrorHandling'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Routes from 'helpers/Routes'
import TwoFactorAuthenticationSetup from './TwoFactorAuthenticationSetup/index.jsx'
import TwoFactorAuthenticationStatus from './TwoFactorAuthenticationStatus/index.jsx'

export default class TwoFactorAuthenticationContainer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      twoFactorEnabled: false,
      settingUp: false,
      entitiesRequiringTwoFactor: []
    }
    this.disableTwoFactorAuthentication = this.disableTwoFactorAuthentication.bind(this)
    this.downloadRecoveryCodes = this.downloadRecoveryCodes.bind(this)
    this.enableTwoFactorAuthentication = this.enableTwoFactorAuthentication.bind(this)
    this.generateRecoveryCodes = this.generateRecoveryCodes.bind(this)
    this.regenerateRecoveryCodes = this.regenerateRecoveryCodes.bind(this)
    this.getQrCode = this.getQrCode.bind(this)
    this.toggleSettingUp = this.toggleSettingUp.bind(this)
    this.verifyToken = this.verifyToken.bind(this)
  }

  componentDidMount() {
    const prevState = _.cloneDeep(this.state)
    Api.get(Routes.currentUser(['entities']))
      .then(currentUser => {
        _.filter(currentUser.entities, { otp_required_for_login: true })
        this.setState({
          twoFactorEnabled: currentUser.otp_required_for_login || false,
          loading: false,
          settingUp: this.props.forcedSetUp,
          entitiesRequiringTwoFactor: _.filter(currentUser.entities, { otp_required_for_login: true })
        })
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  disableTwoFactorAuthentication() {
    const prevState = _.cloneDeep(this.state)
    this.setState({
      twoFactorEnabled: false
    })
    Api.get(Routes.twoFactorAuthenticationDisable())
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  downloadRecoveryCodes(codes) {
    const formattedCodes = codes.map(code => `${code}\r\n`)
    let blob = new Blob(formattedCodes, { type: "text/plain;charset=utf-8" })
    FileSaver.saveAs(blob, "doxly_recovery_codes.txt")
  }

  enableTwoFactorAuthentication() {
    const prevState = _.cloneDeep(this.state)
    this.setState({
      twoFactorEnabled: true
    })
    Api.get(Routes.twoFactorAuthenticationEnable())
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  generateRecoveryCodes(callback = null) {
    const prevState = _.cloneDeep(this.state)
    Api.get(Routes.twoFactorAuthenticationGenerateRecoveryCodes())
      .then(recoveryCodes => {
        callback(recoveryCodes)
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  regenerateRecoveryCodes() {
    this.generateRecoveryCodes(this.downloadRecoveryCodes)
  }

  getQrCode(callback) {
    const prevState = _.cloneDeep(this.state)
    Api.getFile(Routes.twoFactorAuthenticationQrCode())
      .then(blob => {
        callback(URL.createObjectURL(blob))
      })
      .catch(error => { ErrorHandling.setErrors(error, () => this.setState(prevState))})
  }

  toggleSettingUp() {
    this.setState({ settingUp: !this.state.settingUp })
  }

  verifyToken(token) {
    const prevState = _.cloneDeep(this.state)
    return Api.post(Routes.twoFactorAuthenticationVerifyToken(), { token })
  }

  render() {
    const { entitiesRequiringTwoFactor, loading, settingUp, twoFactorEnabled } = this.state
    const { forcedSetUp } = this.props

    if (loading) {
      return <LoadingSpinner />
    }

    const status = (
      <TwoFactorAuthenticationStatus
        entitiesRequiringTwoFactor={entitiesRequiringTwoFactor}
        twoFactorEnabled={twoFactorEnabled}
        disableTwoFactorAuthentication={this.disableTwoFactorAuthentication}
        regenerateRecoveryCodes={this.regenerateRecoveryCodes}
        toggleSettingUp={this.toggleSettingUp}
      />
    )
    return (
      <div className="content">
        <div className="padded-content">
          <div className="container-fluid">
            <div className="panel panel-default">
              <div className="panel-heading">
                <FormattedMessage id='account_settings.two_factor_authentication.two_factor_authentication' />
              </div>
              <div className="panel-body">
                <div className="row">
                  <div style={styles.panel} className="whiteout-ui">
                    {status}
                    <TwoFactorAuthenticationSetup
                      entitiesRequiringTwoFactor={entitiesRequiringTwoFactor}
                      forcedSetUp={forcedSetUp}
                      settingUp={settingUp}
                      downloadRecoveryCodes={this.downloadRecoveryCodes}
                      enableTwoFactorAuthentication={this.enableTwoFactorAuthentication}
                      generateRecoveryCodes={this.generateRecoveryCodes}
                      getQrCode={this.getQrCode}
                      toggleSettingUp={this.toggleSettingUp}
                      verifyToken={this.verifyToken}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    margin: 'auto',
    border: `0.1rem solid ${Colors.whiteout.gray}`,
    background: Colors.whiteout.white,
    marginTop: '3.2rem'
  },
  header: {
    width: '100%',
    borderBottom: `0.1rem solid ${Colors.whiteout.gray}`,
    padding: '0.8rem 2.4rem'
  },
  content: {
    padding: '2.4rem'
  },
  panel: {
    width: '50%',
    paddingLeft: '1.6rem'
  }
}

TwoFactorAuthenticationContainer.propTypes = {
  forcedSetUp: PropTypes.bool.isRequired
}

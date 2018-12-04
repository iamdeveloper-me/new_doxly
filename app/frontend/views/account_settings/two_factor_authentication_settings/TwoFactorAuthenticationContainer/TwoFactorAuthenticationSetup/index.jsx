import Enum from 'enum'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import IntroTab from './IntroTab/index.jsx'
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from 'components/Whiteout/Modal/index.jsx'
import RecoveryCodesTab from './RecoveryCodesTab/index.jsx'
import QrCodeTab from './QrCodeTab/index.jsx'

const TABS = new Enum(['INTRO', 'RECOVERY_CODES', 'QR_CODE'])

export default class TwoFactorAuthenticationSetup extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      downloadedCodes: false,
      qrCode: null,
      recoveryCodes: [],
      selectedTab: this.props.forcedSetUp ? TABS.INTRO : TABS.RECOVERY_CODES,
      token: '',
      tokenError: false
    }
    this.previousTab = this.previousTab.bind(this)
    this.nextTab = this.nextTab.bind(this)
    this.enableTwoFactorAuthentication = this.enableTwoFactorAuthentication.bind(this)
    this.generateRecoveryCodes = this.generateRecoveryCodes.bind(this)
    this.downloadRecoveryCodes = this.downloadRecoveryCodes.bind(this)
    this.getQrCode = this.getQrCode.bind(this)
    this.updateToken = this.updateToken.bind(this)
  }

  componentDidMount() {
    if (this.props.forcedSetUp) {
      this.generateRecoveryCodes()
      this.getQrCode()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settingUp !== this.props.settingUp) {
      if (this.props.settingUp) {
        this.generateRecoveryCodes()
        this.getQrCode()
      } else {
        this.setState({
          downloadedCodes: false,
          qrCode: null,
          recoveryCodes: [],
          selectedTab: TABS.RECOVERY_CODES,
          token: '',
          tokenError: false
        })
      }
    }
  }

  previousTab() {
    this.setState({
      selectedTab: TABS.enums[_.findIndex(TABS.enums, this.state.selectedTab)-1]
    })
  }

  nextTab() {
    this.setState({
      selectedTab: TABS.enums[_.findIndex(TABS.enums, this.state.selectedTab)+1]
    })
  }

  enableTwoFactorAuthentication() {
    this.props.verifyToken(this.state.token)
      .then(() => {
        this.props.toggleSettingUp()
        this.props.enableTwoFactorAuthentication()
      })
      .catch(() => this.setState({ tokenError: true }))
  }

  generateRecoveryCodes() {
    this.props.generateRecoveryCodes(recoveryCodes => this.setState({ recoveryCodes }))
  }

  downloadRecoveryCodes() {
    this.setState({
      downloadedCodes: true
    })
    this.props.downloadRecoveryCodes(this.state.recoveryCodes)
  }

  getQrCode() {
    this.props.getQrCode(qrCode => this.setState({ qrCode }))
  }

  updateToken(token) {
    this.setState({
      token,
      tokenError: false
    })
  }
  
  render() {
    const { entitiesRequiringTwoFactor, forcedSetUp, settingUp } = this.props
    const { downloadRecoveryCodes, enableTwoFactorAuthentication, generateRecoveryCodes, getQrCode, toggleSettingUp, verifyToken } = this.props
    
    const backButton = (
      (!forcedSetUp && this.state.selectedTab === TABS.RECOVERY_CODES)
        || (this.state.selectedTab === _.first(TABS.enums)) ?
        null
      :
        <div style={styles.backButton}>
          <Button
            text={<FormattedMessage id='buttons.back' />}
            type="secondary"
            onClick={this.previousTab}
          />
        </div>
    )

    const primaryButton = (
      this.state.selectedTab === _.last(TABS.enums) ?
        <Button
          text={<FormattedMessage id='account_settings.two_factor_authentication.setup.enable' />}
          type="primary"
          disabled={!this.state.qrCode || (this.state.selectedTab === TABS.QR_CODE && this.state.tokenError)}
          onClick={this.enableTwoFactorAuthentication}
        />
      :
        <Button
          text={<FormattedMessage id='buttons.next' />}
          type="primary"
          disabled={this.state.selectedTab === TABS.RECOVERY_CODES && !this.state.downloadedCodes}
          onClick={this.nextTab}
        />
    )

    let tab = null
    switch(this.state.selectedTab) {
      case TABS.INTRO:
        tab = (
          <IntroTab
            entitiesRequiringTwoFactor={entitiesRequiringTwoFactor}
          />
        )
        break
      case TABS.RECOVERY_CODES:
        tab = (
          <RecoveryCodesTab
            recoveryCodes={this.state.recoveryCodes}
            downloadRecoveryCodes={this.downloadRecoveryCodes}
            generateRecoveryCodes={this.generateRecoveryCodes}
          />
        )
        break
      case TABS.QR_CODE:
        tab = (
          <QrCodeTab
            qrCode={this.state.qrCode}
            token={this.state.token}
            tokenError={this.state.tokenError}
            getQrCode={this.getQrCode}
            updateToken={this.updateToken}
          />
        )
    }

    const cancelButton = (
      !forcedSetUp ?
        <Button
          text={<FormattedMessage id='buttons.cancel' />}
          type="secondary"
          onClick={toggleSettingUp}
        />
      :
        null
    )
    
    return (
      <Modal
        showModal={settingUp}
        hideModal={toggleSettingUp}
        content={
          <div>
            <ModalHeader>
              <FormattedMessage id='account_settings.two_factor_authentication.setup.set_up_two_factor_authentication' />
            </ModalHeader>
            <ModalBody modalStyle=''>
              <div style={styles.body}>
                {tab}
              </div>
            </ModalBody>
            <ModalFooter>
              {cancelButton}
              <div style={styles.buttons}>
                {backButton}
                {primaryButton}
              </div>
            </ModalFooter>
          </div>
        }
      />
    )
  }
}

const styles = {
  buttons: {
    flexGrow: '1',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  backButton: {
    marginRight: '0.8rem'
  },
  body: {
    padding: '2.4rem 3.2rem'
  }
}

TwoFactorAuthenticationSetup.propTypes = {
  entitiesRequiringTwoFactor: PropTypes.array.isRequired,
  forcedSetUp: PropTypes.bool.isRequired,
  settingUp: PropTypes.bool.isRequired,
  
  downloadRecoveryCodes: PropTypes.func.isRequired,
  enableTwoFactorAuthentication: PropTypes.func.isRequired,
  generateRecoveryCodes: PropTypes.func.isRequired,
  getQrCode: PropTypes.func.isRequired,
  toggleSettingUp: PropTypes.func.isRequired,
  verifyToken: PropTypes.func.isRequired
}
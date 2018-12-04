import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Alert from 'components/Whiteout/Alert/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Input from 'components/Whiteout/Input/index.jsx'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'components/Whiteout/Modal/index.jsx'

class SignatureGroupModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      signatureGroup: {
        name: ''
      },
      hasErrors: false
    }
    this.addSignatureGroup = this.addSignatureGroup.bind(this)
    this.updateSignatureGroup = this.updateSignatureGroup.bind(this)
    this.submitSignatureGroup = this.submitSignatureGroup.bind(this)
    this.setAttribute = this.setAttribute.bind(this)
    this.hideModal = this.hideModal.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.signatureGroup && (this.props != prevProps)) {
      this.setState({
        signatureGroup: {
          name: this.props.signatureGroup.name
        }
      })
    } else if (!this.props.signatureGroup && (this.props != prevProps)) {
      this.setState({
        signatureGroup: {
          name: ''
        }
      })
    }
  }

  submitSignatureGroup() {
    this.props.signatureGroup ? this.updateSignatureGroup() : this.addSignatureGroup()
  }

  addSignatureGroup() {
    const { signatureGroup } = this.state
    if (_.isEmpty(_.trim(_.get(signatureGroup, 'name', '')))) {
      this.setState({ hasErrors: true })
    } else {
      this.props.createSignatureGroup(signatureGroup)
      this.setState({ hasErrors: false })
      this.hideModal()
    }
  }

  updateSignatureGroup() {
    if (_.isEmpty(_.trim(_.get(this.state.signatureGroup, 'name', '')))) {
      this.setState({ hasErrors: true })
    } else {
      this.props.updateSignatureGroup(_.merge({}, this.props.signatureGroup, this.state.signatureGroup))
      this.setState({ hasErrors: false })
      this.hideModal()
    }
  }

  setAttribute(value) {
    let signatureGroup = _.cloneDeep(this.state.signatureGroup)
    signatureGroup['name'] = value
    this.setState({ signatureGroup })
  }

  hideModal() {
    this.setState({ hasErrors: false })
    this.props.hideModal()
  }

  render() {
    const { intl, showModal, signatureGroup } = this.props

    return (
      <Modal
        size='700'
        showModal={showModal}
        hideModal={this.hideModal}
        content={
          <div>
            <ModalHeader>
              {signatureGroup ?
                <FormattedMessage id='signature_management.signature_groups.edit' />
              :
                <FormattedMessage id='signature_management.signature_groups.new' />
              }
            </ModalHeader>
            <ModalBody>
              {this.state.hasErrors ?
                <div style={styles.alert}>
                  <Alert
                    status='error'
                    message={<FormattedMessage id='signature_management.signature_groups.error' />}
                  />
                </div>
              :
                null
              }
              <Input
                autoFocus={true}
                type='text'
                size='large'
                labelText={<FormattedMessage id='signature_management.signature_groups.signature_group_name' />}
                placeholder={intl.formatMessage({ id: 'signature_management.signature_groups.signature_group_name' })}
                value={this.state.signatureGroup.name}
                onChange={(e) => this.setAttribute(e.target.value)}
                onEnter={this.submitSignatureGroup}
              />
            </ModalBody>
            <ModalFooter style={styles.footer}>
              <Button
                type='secondary'
                onClick={this.hideModal}
                text={<FormattedMessage id='buttons.cancel' />}
              />
              <Button
                type='primary'
                text={<FormattedMessage id='buttons.save' />}
                onClick={this.submitSignatureGroup}
              />
            </ModalFooter>
          </div>
        }
      />
    )
  }
}

const styles = {
  alert: {
    paddingBottom: '1.2rem'
  },
  footer: {
    padding: '0'
  }
}

SignatureGroupModal.defaultProps = {
  signatureGroup: null
}

SignatureGroupModal.propTypes = {
  intl: intlShape.isRequired,
  showModal: PropTypes.bool.isRequired,
  signatureGroup: PropTypes.object,

  createSignatureGroup: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  updateSignatureGroup: PropTypes.func.isRequired
}

export default injectIntl(SignatureGroupModal)

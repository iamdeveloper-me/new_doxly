import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Checkbox from 'components/Whiteout/Checkbox/index.jsx'
import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'

class SignerName extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onCheck = this.onCheck.bind(this)
  }

  isBlankField(field) {
    return _.trim(field) === ''
  }

  getKey(key) {
    const { index } = this.props
    const attributeKey = index !== null ? `signing_capacities[${index}].${key}` : key
    return attributeKey
  }

  onCheck() {
    const { index, usePlaceholder } = this.props

    if (!usePlaceholder) {
      this.props.addPlaceholder(index)
    } else {
      this.props.subtractPlaceholder(index)
    }
  }

  render() {
    const { alerts, firstName, formSubmitted, index, intl, isEntitySigner, lastName, placeholderId, usePlaceholder } = this.props
    const { setAttribute } = this.props
    const invalidEntity = isEntitySigner ? _.find(alerts, { 'signer_position': index, 'blank_signer_name': true }) : true

    return (
      <div>
        <div style={styles.checkbox}>
          <Checkbox
            text={<FormattedMessage id='signature_management.signer_forms.use_placeholder' />}
            checked={usePlaceholder}
            onChange={this.onCheck}
          />
          <div style={styles.helperText}>
            <FormattedMessage id='signature_management.signer_forms.placeholder_description' />
          </div>
        </div>
        <div style={styles.placeholderName(usePlaceholder)}>
          <Input
            type='text'
            size='medium'
            style={styles.input}
            labelText={<FormattedMessage id='signature_management.signer_forms.placeholder_name' />}
            value={intl.formatMessage({ id: 'signature_management.signer_forms.unnamed_signer' }, { unnamedSignerCount: placeholderId })}
            disabled={true}
          />
        </div>
        <div style={styles.signerName(usePlaceholder)}>
          <Input
            type='text'
            size='medium'
            style={styles.input}
            labelText={<FormattedMessage id='signature_management.signer_forms.first_name' />}
            placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.first_name' })}
            value={firstName}
            invalid={formSubmitted && invalidEntity && this.isBlankField(firstName)}
            onChange={(e) => setAttribute(this.getKey('first_name'), e.target.value)}
          />
          <Input
            type='text'
            size='medium'
            style={styles.input}
            labelText={<FormattedMessage id='signature_management.signer_forms.last_name' />}
            placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.last_name' })}
            value={lastName}
            invalid={formSubmitted && invalidEntity && this.isBlankField(lastName)}
            onChange={(e) => setAttribute(this.getKey('last_name'), e.target.value)}
          />
        </div>
      </div>
    )
  }
}

const styles = {
  checkbox: {
    marginBottom: '1.2rem'
  },
  helperText: {
    marginLeft: '2.4rem',
    fontStyle: 'italic',
    color: Colors.gray.light
  },
  signerName: usePlaceholder => ({
    display: usePlaceholder ? 'none' : 'flex',
    justifyContent: 'space-between'
  }),
  placeholderName: usePlaceholder => ({
    display: usePlaceholder ? 'block' : 'none'
  }),
  input: {
    width: '100%'
  }
}

SignerName.defaultProps = {
  alerts: [],
  index: null,
  isEntitySigner: false,
  placeholderId: null
}

SignerName.propTypes = {
  alerts: PropTypes.array,
  firstName: PropTypes.string.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  index: PropTypes.number,
  isEntitySigner: PropTypes.bool,
  lastName: PropTypes.string.isRequired,
  placeholderId: PropTypes.number,
  usePlaceholder: PropTypes.bool.isRequired,

  addPlaceholder: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
  subtractPlaceholder: PropTypes.func.isRequired
}

export default injectIntl(SignerName)

import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Input from 'components/Whiteout/Input/index.jsx'

class Address extends React.PureComponent {
  render() {
    const { address, attributeKey, intl } = this.props
    const { setAttribute } = this.props

    return (
      <div>
        <Input
          type='text'
          size='large'
          labelText={<FormattedMessage id='address.street' />}
          placeholder={intl.formatMessage({ id: 'address.street_description' })}
          value={address.address_line_one}
          onChange={(e) => setAttribute(`${attributeKey}.address_line_one`, e.target.value)}
        />
        <Input
          type='text'
          size='large'
          placeholder={intl.formatMessage({ id: 'address.suite' })}
          value={address.address_line_two}
          onChange={(e) => setAttribute(`${attributeKey}.address_line_two`, e.target.value)}
        />
        <div style={styles.cityStateZip}>
          <Input
            type='text'
            style={styles.input}
            labelText={<FormattedMessage id='address.city' />}
            placeholder={intl.formatMessage({ id: 'address.city' })}
            value={address.city}
            onChange={(e) => setAttribute(`${attributeKey}.city`, e.target.value)}
          />
          <Input
            type='text'
            style={styles.input}
            labelText={<FormattedMessage id='address.state_or_province' />}
            placeholder={intl.formatMessage({ id: 'address.state_or_province' })}
            value={address.state_or_province}
            onChange={(e) => setAttribute(`${attributeKey}.state_or_province`, e.target.value)}
          />
          <Input
            type='text'
            style={styles.input}
            labelText={<FormattedMessage id='address.postal_code' />}
            placeholder={intl.formatMessage({ id: 'address.postal_code' })}
            value={address.postal_code}
            onChange={(e) => setAttribute(`${attributeKey}.postal_code`, e.target.value)}
          />
        </div>
      </div>
    )
  }
}

const styles = {
  cityStateZip: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  input: {
    width: '100%'
  }
}

Address.defaultProps = {
  isCopyTo: false
}

Address.propTypes = {
  address: PropTypes.object.isRequired,
  attributeKey: PropTypes.string.isRequired,
  intl: intlShape.isRequired,

  setAttribute: PropTypes.func.isRequired
}

export default injectIntl(Address)

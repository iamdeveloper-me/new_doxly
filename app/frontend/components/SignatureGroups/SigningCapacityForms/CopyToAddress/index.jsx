import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Address from 'components/SignatureGroups/SigningCapacityForms/Address/index.jsx'
import Checkbox from 'components/Whiteout/Checkbox/index.jsx'

export default class CopyToAddress extends React.PureComponent {
  render() {
    const { attributeKey, copyToAddress } = this.props

    return (
      <div>
        <Checkbox
          text={<FormattedMessage id='signature_management.signer_forms.copy_to_address' />}
          checked={copyToAddress.use_copy_to}
          onChange={() => this.props.setAttribute('copy_to_address.use_copy_to', !copyToAddress.use_copy_to)}
        />
        <div style={styles.copyTo(copyToAddress.use_copy_to)}>
          <div style={styles.withCopyTo}>
            <FormattedMessage id='signature_management.with_copy_to' />
          </div>
          <Address
            address={copyToAddress}
            attributeKey={attributeKey}
            setAttribute={this.props.setAttribute}
          />
        </div>
      </div>
    )
  }
}

const styles = {
  copyTo: showCopyTo => ({
    display: showCopyTo ? 'block' : 'none'
  }),
  withCopyTo: {
    margin: '1.2rem 0'
  }
}

CopyToAddress.propTypes = {
  attributeKey: PropTypes.string.isRequired,
  copyToAddress: PropTypes.object.isRequired,

  setAttribute: PropTypes.func.isRequired
}

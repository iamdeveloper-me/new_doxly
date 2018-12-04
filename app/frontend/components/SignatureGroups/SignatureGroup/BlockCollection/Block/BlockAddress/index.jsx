import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const BlockAddress = ({ copyToAddress, primaryAddress }) => (
  <div style={styles.addressBlock}>
    {primaryAddress ?
      <div style={styles.address}>
        <div>{primaryAddress.address_line_one}</div>
        <div>{primaryAddress.address_line_two}</div>
        <div>{(primaryAddress.state_or_province || primaryAddress.postal_code) && primaryAddress.city ? `${primaryAddress.city}, ` : primaryAddress.city}{`${primaryAddress.state_or_province} ${primaryAddress.postal_code}`}</div>
      </div>
    :
      null
    }
    {copyToAddress && (copyToAddress.use_copy_to || copyToAddress.use_copy_to === undefined) ?
      <div style={styles.address}>
        <FormattedMessage id='signature_management.with_copy_to' />
        <div>{copyToAddress.address_line_one}</div>
        <div>{copyToAddress.address_line_two}</div>
        <div>{(copyToAddress.state_or_province || copyToAddress.postal_code) && copyToAddress.city ? `${copyToAddress.city}, ` : copyToAddress.city}{`${copyToAddress.state_or_province} ${copyToAddress.postal_code}`}</div>
      </div>
    :
      null
    }
  </div>
)

const styles = {
  addressBlock: {
    color: Colors.whiteout.moderateGray
  },
  address: {
    paddingTop: '1rem',
    lineHeight: '1.25'
  }
}

BlockAddress.defaultProps = {
  copyToAddress: null,
  priamryAddress: null
}

BlockAddress.propTypes = {
  copyToAddress: PropTypes.object,
  primaryAddress: PropTypes.object
}

export default BlockAddress

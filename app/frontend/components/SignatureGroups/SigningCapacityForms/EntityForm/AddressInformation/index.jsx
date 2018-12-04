import PropTypes from 'prop-types'
import React from 'react'

import Address from 'components/SignatureGroups/SigningCapacityForms/Address/index.jsx'
import CopyToAddress from 'components/SignatureGroups/SigningCapacityForms/CopyToAddress/index.jsx'

export default class AddressInformation extends React.PureComponent {
  render() {
    return (
      <div>
        <Address
          address={this.props.address}
          attributeKey={'primary_address'}
          setAttribute={this.props.setAttribute}
        />
        <CopyToAddress
          copyToAddress={this.props.copyToAddress}
          attributeKey={'copy_to_address'}
          setAttribute={this.props.setAttribute}
        />
      </div>
    )
  }
}

AddressInformation.propTypes = {
  address: PropTypes.object.isRequired,
  copyToAddress: PropTypes.object.isRequired,

  setAttribute: PropTypes.func.isRequired
}

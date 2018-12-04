import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Address from 'components/SignatureGroups/SigningCapacityForms/Address/index.jsx'
import BlockAlert from 'components/SignatureGroups/SigningCapacityForms/BlockAlert/index.jsx'
import CopyToAddress from 'components/SignatureGroups/SigningCapacityForms/CopyToAddress/index.jsx'
import Input from 'components/Whiteout/Input/index.jsx'
import SignerName from 'components/SignatureGroups/SigningCapacityForms/SignerName/index.jsx'

class SignerInformation extends React.PureComponent {
  render() {
    const { alerts, formSubmitted, intl, isEditing, signingCapacity } = this.props
    const { addPlaceholder, setAttribute, subtractPlaceholder } = this.props

    return (
      <div>
        <BlockAlert
          alerts={alerts}
          signingCapacity={signingCapacity}
          isEditing={isEditing}
        />
        <SignerName
          firstName={signingCapacity.first_name}
          lastName={signingCapacity.last_name}
          placeholderId={signingCapacity.placeholder_id}
          usePlaceholder={signingCapacity.use_placeholder_name}
          formSubmitted={formSubmitted}
          setAttribute={setAttribute}
          addPlaceholder={addPlaceholder}
          subtractPlaceholder={subtractPlaceholder}
        />
        <Input
          type='text'
          size='large'
          labelText={<FormattedMessage id='signature_management.signer_forms.email' />}
          placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.email' })}
          value={signingCapacity.user.email || ''}
          invalid={alerts['invalid_email']}
          onChange={(e) => setAttribute('user.email', e.target.value)}
        />
        <Address
          address={signingCapacity.primary_address}
          attributeKey={'primary_address'}
          setAttribute={setAttribute}
        />
        <CopyToAddress
          copyToAddress={signingCapacity.copy_to_address}
          attributeKey={'copy_to_address'}
          setAttribute={setAttribute}
        />
      </div>
    )
  }
}

SignerInformation.propTypes = {
  alerts: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  isEditing: PropTypes.bool.isRequired,
  signingCapacity: PropTypes.object.isRequired,

  addPlaceholder: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
  subtractPlaceholder: PropTypes.func.isRequired
}

export default injectIntl(SignerInformation)

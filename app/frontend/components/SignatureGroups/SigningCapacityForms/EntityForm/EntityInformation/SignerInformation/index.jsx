import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import BlockAlert from 'components/SignatureGroups/SigningCapacityForms/BlockAlert/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'
import SignerName from 'components/SignatureGroups/SigningCapacityForms/SignerName/index.jsx'

class SignerInformation extends React.PureComponent {
  render() {
    const { alerts, formSubmitted, intl, isEditing, signingCapacities } = this.props
    const { addPlaceholder, addSigningCapacity, removeSigningCapacity, setAttribute, subtractPlaceholder } = this.props

    return (
      <div>
        {_.map(signingCapacities, (signingCapacity, i) => (
          <div key={`${signingCapacity}_${i}`}>
            <BlockAlert
              signingCapacity={signingCapacity}
              alerts={_.find(alerts, { 'signer_position': i }) || {}}
              signerWarning={true}
              isEditing={isEditing}
            />
            <div style={styles.signerInfo}>
              <FormattedMessage id='signature_management.signer_forms.by' />
              <Button
                icon={'delete'}
                color={Colors.button.red}
                onClick={() => removeSigningCapacity(i)}
              />
            </div>
            <SignerName
              firstName={signingCapacity.first_name}
              lastName={signingCapacity.last_name}
              placeholderId={signingCapacity.placeholder_id}
              usePlaceholder={signingCapacity.use_placeholder_name}
              index={i}
              alerts={alerts}
              formSubmitted={formSubmitted}
              isEntitySigner={true}
              setAttribute={setAttribute}
              addPlaceholder={addPlaceholder}
              subtractPlaceholder={subtractPlaceholder}
            />
            <div style={styles.signerInfo}>
              <Input
                type='text'
                size='medium'
                style={styles.input}
                labelText={<FormattedMessage id='signature_management.signer_forms.title' />}
                placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.title' })}
                value={signingCapacity.title === '[Title]' ? '' : signingCapacity.title}
                onChange={(e) => setAttribute(`signing_capacities[${i}].title`, e.target.value)}
              />
              <Input
                type='text'
                size='medium'
                style={styles.input}
                labelText={<FormattedMessage id='signature_management.signer_forms.email' />}
                placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.email' })}
                invalid={!_.isEmpty(_.find(alerts, { 'signer_position': i, 'invalid_email': true }))}
                value={signingCapacity.user.email || ''}
                onChange={(e) => setAttribute(`signing_capacities[${i}].user.email`, e.target.value)}
              />
            </div>
          </div>
        ))}
        <div style={styles.break}></div>
        <div
          style={styles.button(signingCapacities.length > 1)}
          onClick={addSigningCapacity}
        >
          <i style={styles.circle} className="mdi mdi-plus-circle"></i>
          <FormattedMessage id='signature_management.signer_forms.add_additional_signer' />
        </div>
      </div>
    )
  }
}

const styles = {
  signerInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    width: '100%'
  },
  break: {
    paddingTop: '1.4rem',
    borderBottom: `0.1rem solid ${Colors.gray.light}`,
    margin: '0 -1.5rem'
  },
  button: disabled => ({
    display: 'flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    paddingTop: '1.2rem',
    color: Colors.whiteout.blue,
    opacity: disabled ? '0.45' : '1'
  }),
  circle: {
    borderRadius: '50%',
    height: '2.4rem',
    width: '2.4rem',
    backgroundColor: Colors.whiteout.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.8rem',
    margin: '0 0.4rem'
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
  signingCapacities: PropTypes.array.isRequired,

  addPlaceholder: PropTypes.func.isRequired,
  addSigningCapacity: PropTypes.func.isRequired,
  removeSigningCapacity: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
  subtractPlaceholder: PropTypes.func.isRequired
}

export default injectIntl(SignerInformation)

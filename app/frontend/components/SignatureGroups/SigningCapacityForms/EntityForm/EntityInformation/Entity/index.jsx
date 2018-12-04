import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'

class Entity extends React.PureComponent {
  render() {
    const { descendants, entityName, formSubmitted, intl  } = this.props
    const { addDescendant, removeDescendant, setAttribute } = this.props
    return (
      <div>
        <h4 style={styles.heading}>
          <FormattedMessage id='signature_management.signer_forms.signing_entity' />
        </h4>
        <Input
          type='text'
          size='large'
          labelText={<FormattedMessage id='signature_management.signer_forms.name' />}
          placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.signing_entity_name' })}
          value={entityName}
          invalid={formSubmitted && _.isEmpty(_.trim(entityName))}
          onChange={(e) => setAttribute('name', e.target.value)}
        />
        {_.map(descendants, (descendant, i) => (
          <div key={`${descendant.id}_${i}`} style={styles.signingAuthorities(i)}>
            <div style={styles.by}>
              <FormattedMessage id='signature_management.signer_forms.by' />
            </div>
            <Input
              type='text'
              size='medium'
              style={styles.input}
              placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.signing_entity_name' })}
              value={descendant.name}
              onChange={(e) => setAttribute(`descendants[${i}].name`, e.target.value)}
            />
            <div style={styles.its}>
              <FormattedMessage id='signature_management.signer_forms.its' />
            </div>
            <Input
              type='text'
              style={styles.input}
              placeholder={intl.formatMessage({ id: 'signature_management.signer_forms.title' })}
              value={descendant.title || ''}
              onChange={(e) => setAttribute(`descendants[${i}].title`, e.target.value)}
            />
            <Button
              icon='close'
              color={Colors.whiteout.blue}
              onClick={() => removeDescendant(i)}
            />
          </div>
        ))}
        <div
          style={styles.button}
          onClick={addDescendant}
        >
          <i style={styles.circle} className="mdi mdi-plus-circle"></i>
          <FormattedMessage id='signature_management.signer_forms.add_signing_entity' />
          <div style={styles.helperText}>
            <FormattedMessage id='signature_management.signer_forms.signing_authority_description' />
          </div>
        </div>
        <div style={styles.break}></div>
      </div>
    )
  }
}

const styles = {
  heading: {
    margin: '1.2rem 0'
  },
  signingAuthorities: index => ({
    display: 'flex',
    alignItems: 'baseline',
    paddingLeft: `${index}rem`
  }),
  by: {
    marginRight: '0.4rem'
  },
  input: {
    width: '100%'
  },
  its: {
    margin: '0 0.4rem'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: Colors.whiteout.blue
  },
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
  },
  helperText: {
    color: Colors.gray.light,
    marginLeft: '0.4rem'
  },
  break: {
    paddingTop: '1.4rem',
    borderBottom: `0.1rem solid ${Colors.gray.light}`,
    margin: '0 -1.5rem'
  }
}

Entity.propTypes = {
  descendants: PropTypes.array.isRequired,
  entityName: PropTypes.string.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,

  addDescendant: PropTypes.func.isRequired,
  removeDescendant: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired
}

export default injectIntl(Entity)

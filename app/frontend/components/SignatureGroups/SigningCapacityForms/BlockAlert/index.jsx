import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'components/Whiteout/Alert/index.jsx'

class BlockAlert extends React.PureComponent {
  getAlert() {
    const { alerts, isEditing, signingCapacity } = this.props
    const hasBlankNameField = alerts['blank_signer_name'] || alerts['blank_entity_name']

    if (hasBlankNameField || alerts['invalid_email'] || alerts['matching_signers']) {
      const messages = []
      alerts['blank_entity_name'] ? messages.push(<FormattedMessage id='signature_management.form_errors.entity_name' />) : null
      alerts['blank_signer_name'] ? messages.push(<FormattedMessage id='signature_management.form_errors.name_or_placeholder' />) : null
      alerts['invalid_email'] ? messages.push(<FormattedMessage id='signature_management.form_errors.invalid_email' />) : null
      alerts['matching_signers'] ? messages.push(<FormattedMessage id='signature_management.form_errors.matching_signers' />) : null
      return (
        <Alert
          status='error'
          messageTitle={messages}
        />
      )
    } else if (alerts['has_sent_packets'] && isEditing) {
      return (
        <Alert
          status='error'
          messageTitle={<FormattedMessage id='signature_management.form_errors.sent_packets_signer_name_error' />}
          subMessages={[
            <FormattedMessage
              key={_.uniqueId()}
              id='signature_management.form_errors.match_sent'
              values={{ signerName: signingCapacity.name }}
            />,
            <FormattedMessage
              key={_.uniqueId()}
              id='signature_management.form_errors.choose_different_email'
            />
          ]}
        />
      )
    } else if (alerts['existing_signer']) {
      const existingSigner = alerts['existing_signer']
      const signingCapacityName = signingCapacity.use_placeholder_name ? `Unnamed Signer ${signingCapacity.placeholder_id}` : `${signingCapacity.first_name} ${signingCapacity.last_name}`

      if (alerts['existing_signer_has_sent_packets']) {
        return (
          <Alert
            status='warning'
            messageTitle={<FormattedMessage id='signature_management.form_errors.sent_packets_signer_name_error' />}
            subMessages={[
              <FormattedMessage
                key={_.uniqueId()}
                id='signature_management.form_errors.match_sent'
                values={{ signerName: existingSigner.name }}
              />,
              <FormattedMessage
                key={_.uniqueId()}
                id='signature_management.form_errors.choose_different_email'
              />
            ]}
          />
        )
      } else {
        const bothUnnamed = existingSigner.placeholder_id !== null
        const changeNameMessage = <FormattedMessage
                                    key={_.uniqueId()}
                                    id='signature_management.form_errors.change_email'
                                    values={{ signerName: existingSigner.name }}
                                  />
        const unnamedMessages = [
          <FormattedMessage
            key={_.uniqueId()}
            id='signature_management.form_errors.overwrite_unnamed_names'
            values={{ signerName: signingCapacityName }}
          />,
          <FormattedMessage
            key={_.uniqueId()}
            id='signature_management.form_errors.use_different_email'
          />
        ]

        const namedMessages = [
          <FormattedMessage
            key={_.uniqueId()}
            id='signature_management.form_errors.change_email'
            values={{ signerName: existingSigner.name }}
          />,
          <FormattedMessage
            key={_.uniqueId()}
            id='signature_management.form_errors.overwrite_names'
            values={{ signerName: signingCapacityName }}
          />,
          <FormattedMessage
            key={_.uniqueId()}
            id='signature_management.form_errors.use_different_email'
          />
        ]

        return (
          <Alert
            status='warning'
            messageTitle={<FormattedMessage id='signature_management.form_errors.existing_signer' />}
            subMessages={bothUnnamed ? unnamedMessages : namedMessages}
          />
        )
      }
    }
  }

  render() {
    const { alerts, signerWarning } = this.props
    const hasAlert = !_.isEmpty(alerts)

    return (
      <div style={styles.alert(hasAlert, signerWarning)}>
        {hasAlert ? this.getAlert() : null}
      </div>
    )
  }
}

const styles = {
  alert: (hasAlert, signerWarning) => ({
    display: hasAlert ? 'flex' : 'none',
    paddingBottom: hasAlert ? '1.2rem' : '0rem',
    paddingTop: signerWarning ? '1.2rem' : '0rem'
  })
}

BlockAlert.defaultProps = {
  signerWarning: false
}

BlockAlert.propTypes = {
  alerts: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  signerWarning: PropTypes.bool,
  signingCapacity: PropTypes.object
}

export default BlockAlert

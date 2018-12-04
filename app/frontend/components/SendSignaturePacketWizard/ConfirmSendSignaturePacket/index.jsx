import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Checkbox from 'components/Whiteout/Checkbox/index.jsx'
import Radio from 'components/Whiteout/Radio/index.jsx'
import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'
import Textarea from 'components/Whiteout/Textarea/index.jsx'
import { enumValueSchema, SIGNATURE_PACKET_TYPES } from 'helpers/Enums'

class ConfirmSendSignaturePacket extends React.PureComponent {

  render() {
    const { copy_to, hasRecipients, packetType, intl, invalidCopyTo, message } = this.props
    const { setAttribute, setHasRecipients, setPacketType } = this.props
    return (
      <div style={styles.container}>
        <div style={styles.packetTypeHeader}>
          <h4><FormattedMessage id='send_signature_packets.packet_type' /></h4>
        </div>
        <Radio
          text={<FormattedMessage id='send_signature_packets.packet_types.email' />}
          checked={packetType === SIGNATURE_PACKET_TYPES.email}
          onChange={() => setPacketType(SIGNATURE_PACKET_TYPES.email)}
        />
        <div style={styles.emailPacketTypeOptions(packetType)}>
          <div style={styles.textarea}>
            <Textarea
              size='large'
              labelText={<FormattedMessage id='send_signature_packets.confirm_send.add_message' />}
              placeholder={intl.formatMessage({ id: 'send_signature_packets.confirm_send.message_description' })}
              value={message}
              onChange={(e) => setAttribute('message', e.target.value)}
            />
          </div>
          <Checkbox
            text={<FormattedMessage id='send_signature_packets.confirm_send.send_copy' />}
            checked={hasRecipients}
            onChange={setHasRecipients}
          />
          <div style={styles.description}>
            <FormattedMessage id='send_signature_packets.confirm_send.send_copy_description' />
          </div>
          <div style={styles.inputsContainer(hasRecipients)}>
            <Input
              type='text'
              size='large'
              labelText={<FormattedMessage id='send_signature_packets.confirm_send.recipients' />}
              placeholder={intl.formatMessage({ id: 'send_signature_packets.confirm_send.email_input' })}
              value={copy_to}
              onChange={(e) => setAttribute('copy_to', e.target.value)}
              invalid={invalidCopyTo}
            />
          </div>
        </div>
        <Radio
          text={<FormattedMessage id='send_signature_packets.packet_types.link' />}
          checked={packetType === SIGNATURE_PACKET_TYPES.link}
          onChange={() => setPacketType(SIGNATURE_PACKET_TYPES.link)}
        />
        <Radio
          text={<FormattedMessage id='send_signature_packets.packet_types.download' />}
          checked={packetType === SIGNATURE_PACKET_TYPES.download}
          onChange={() => setPacketType(SIGNATURE_PACKET_TYPES.download)}
        />
      </div>

    )
  }
}

const styles = {
  container: {
    padding: '3.2rem 3.2rem 0'
  },
  packetTypeHeader: {
    marginBottom: '1.6rem'
  },
  emailPacketTypeOptions: packetType => ({
    display: packetType == SIGNATURE_PACKET_TYPES.email ? 'block' : 'none',
    paddingLeft: '2.6rem'
  }),
  description: {
    paddingLeft: '2.6rem',
    paddingBottom: '0.8rem',
    fontStyle: 'italic',
    color: Colors.gray.light
  },
  textarea: {
    paddingBottom: '0.4rem'
  },
  inputsContainer: hasRecipients => ({
    display: hasRecipients ? 'flex' : 'none',
    flexDirection: 'column',
    paddingLeft: '2.6rem'
  })
}

ConfirmSendSignaturePacket.propTypes = {
  copy_to: PropTypes.string.isRequired,
  hasRecipients: PropTypes.bool.isRequired,
  packetType: enumValueSchema,
  intl: intlShape.isRequired,
  invalidCopyTo: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,

  setAttribute: PropTypes.func.isRequired,
  setHasRecipients: PropTypes.func.isRequired,
  setPacketType: PropTypes.func.isRequired
}

export default injectIntl(ConfirmSendSignaturePacket)

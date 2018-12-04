import { Enum } from 'enumify'
import PropTypes from 'prop-types'

export const enumValueSchema = PropTypes.shape({
  name: PropTypes.string.isRequired,
  ordinal: PropTypes.number.isRequired
})

export class SIGNATURE_PACKET_TYPES extends Enum {}
SIGNATURE_PACKET_TYPES.initEnum(['link', 'download', 'email'])

export class SIGNATURE_TYPES extends Enum {}
SIGNATURE_TYPES.initEnum(['no_signature', 'signature_required', 'voting_threshold_required'])

import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const SENDING_TO_DMS_STATUSES = {
  sending: 'sending',
  failed: 'failed'
}

export default class SendingToDmsStatus extends React.PureComponent {

  render() {
    const { version } = this.props
    return (
      <div style={styles.container}>
        {version.sending_to_dms_status === SENDING_TO_DMS_STATUSES.sending ?
          <FormattedMessage
            id='category.tree_element.attachment.version.sending_to_dms_status.sending'
           />
        :
          <FormattedMessage
            id='category.tree_element.attachment.version.sending_to_dms_status.failed'
           />
        }
      </div>
    )
  }
}

const styles = {
  container: {
    color: Colors.text.gray,
    fontSize: '12px'
  }
}


SendingToDmsStatus.propTypes = {
  version: PropTypes.object.isRequired
}

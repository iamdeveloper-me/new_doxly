import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const Actions = ({ hover, linkedBlock, onDelete, onEdit, onUnlink }) => (
  <div style={styles.actions(hover)}>
    {linkedBlock ?
      <div style={styles.remove} onClick={onUnlink}>
        <i className="mdi mdi-close"></i>
        <FormattedMessage id='buttons.unlink' />
      </div>
    :
      <div style={styles.remove} onClick={onDelete}>
        <i className="mdi mdi-close"></i>
        <FormattedMessage id='buttons.delete' />
      </div>
    }
    <div style={styles.edit} onClick={onEdit}>
      <i className="mdi mdi-pencil"></i>
      <FormattedMessage id='buttons.edit' />
    </div>
  </div>

)

const styles = {
  container: {
    marginBottom: '4.8rem'
  },
  header: {
    height: '2rem'
  },
  actions: hover => ({
    display: hover ? 'flex' : 'none',
    justifyContent: 'flex-end'
  }),
  remove: {
    paddingRight: '1.2rem',
    color: Colors.whiteout.alert.error
  },
  edit: {
    color: Colors.whiteout.blue
  }
}

Actions.propTypes = {
  hover: PropTypes.bool.isRequired,
  linkedBlock: PropTypes.bool.isRequired,

  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired
}

export default Actions

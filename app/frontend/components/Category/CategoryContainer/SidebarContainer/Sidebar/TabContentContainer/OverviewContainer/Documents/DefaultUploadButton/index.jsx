import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class DefaultUploadButton extends React.PureComponent {

  render () {
    return (
      <div onClick={this.props.uploadNewVersion}>
        <div style={styles.button}>
          <FormattedMessage id='category.sidebar.document.attachment.upload' />
          <i className="mdi mdi-upload" style={styles.addIcon}></i>
        </div>
      </div>
    )
  }
}

const styles = {
  button: {
    color: Colors.button.blue,
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  addIcon: {
    marginLeft: '0.8rem',
    fontSize: '1.4rem',
    background: Colors.button.blue,
    color: 'white',
    height: '1.8rem',
    width: '1.8rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

DefaultUploadButton.propTypes = {
  uploadNewVersion: PropTypes.func.isRequired
}

import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import Colors from 'helpers/Colors'

export default class WhiteoutPdfViewer extends React.PureComponent {

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.background}></div>
        <div style={styles.modal}>
          <div style={styles.top}>
            <div style={styles.header}>
              <FormattedMessage id='executed_versions.preview' />
              <div>
                <h3>{this.props.title}</h3>
              </div>
            </div>
            <div style={styles.closeButton}>
              <CloseButton onClick={this.props.onClose} />
            </div>
          </div>
          <iframe style={styles.iframe} src={this.props.pagePath} />
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    position: 'fixed',
    overflow: 'hidden',
    zIndex: 1,
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    fontFamily: '"Roboto", "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif'
  },
  background: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: '0',
    backgroundColor: Colors.black,
    opacity: '0.7'
  },
  modal: {
    height: '90%',
    position: 'relative',
    margin: '40px 60px 0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.white
  },
  top: {
    width: '100%',
    height: '12%',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0',
    borderBottom: `1px solid ${Colors.gray.normal}`
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: '0',
    top: '0'
  },
  iframe: {
    flexGrow: '1',
    width: '100%',
    border: 'none'
  }
}

WhiteoutPdfViewer.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  pagePath: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired
}

import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class Error extends React.PureComponent {

  render() {
    const { title, body, actions } = this.props
    return (
      <div style={styles.error}>
        <i style={styles.icon} className="fa fa-exclamation-circle fa-4x" aria-hidden="true"></i>
        <div style={styles.title}>{title}</div>
        <div style={styles.body}>{body}</div>
        <div style={styles.actions}>{actions}</div>
      </div>
    )
  }

}

const styles = {
  error: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: Colors.pink.normal
  },
  title: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '5px',
    maxWidth: '300px',
    textAlign: 'center'
  },
  body: {
    maxWidth: '300px',
    textAlign: 'center'
  },
  actions: {
    marginTop: '20px'
  }
}

Error.defaultProps = {
  title: <div>Oops! Something went wrong.</div>,
  body: <div>Please contact support@doxly.com for assistance.</div>
}

Error.propTypes = {
  title: PropTypes.element,
  body: PropTypes.element,
  actions: PropTypes.element
}

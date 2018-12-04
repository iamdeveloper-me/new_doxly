import PropTypes from 'prop-types'
import React from 'react'

export default class Empty extends React.PureComponent {

  render() {
    return (
      <div style={styles.empty}>
        <div style={styles.icon}>{this.props.icon}</div>
        <div>{this.props.text}</div>
      </div>
    )
  }

}

const styles = {
  empty: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  icon: {
    marginBottom: '20px'
  }
}

Empty.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.object.isRequired
}

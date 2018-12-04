import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class EmptyStateButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.addElement()
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.header}>{this.props.header}</div>
        <button style={styles.button} onClick={this.onClick}>
          <div className="glyphicon glyphicon-plus-sign" aria-hidden="true" style={styles.addIcon} />
          <div style={styles.textBlock}>
            <div style={styles.text}>{this.props.text}</div>
            <div style={styles.subText}>{this.props.subText}</div>
          </div>
        </button>
      </div>
    )
  }
}


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    fontSize: '12px',
    color: Colors.gray.darkest
  },
  button: {
    display: 'flex',
    color: Colors.button.blue,
    fontSize: '12px',
    width: '75%',
    alignSelf: 'center',
    paddingTop: '20px'
  },
  addIcon: {
    fontSize: '40px'
  },
  text: {
    fontSize: '16px'
  },
  textBlock: {
    textAlign: 'left',
    paddingLeft: '8px'
  },
  subText: {
    color: Colors.black
  }
}

EmptyStateButton.propTypes = {
  addElement: PropTypes.func,
  header: PropTypes.element.isRequired,
  text: PropTypes.element.isRequired,
  subText: PropTypes.element.isRequired
}

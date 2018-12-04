import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import "react-day-picker/lib/style.css"

export default class Time extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onClick = this.onClick.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  onClick() {
    this.props.setTime(this.props.time)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  render() {
    return (
      <div
        style={styles.container(this.state.hover)}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        {this.props.time}
      </div>
    )
  }

}

const styles = {
  container: hover => ({
    textAlign: 'right',
    padding: '4px 12px',
    minWidth: '75px',
    cursor: 'pointer',
    color: hover ? Colors.white : Colors.gray.dark,
    backgroundColor: hover ? Colors.button.blue : Colors.white
  })
}

Time.propTypes = {
  // attributes
  time: PropTypes.string,

  // functions
  setTime: PropTypes.func.isRequired
}

import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class TooltipsterDropdownItem extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onClick = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onClick(e) {
    this.setState({ hover: false })
    this.props.onClick(e)
  }

  onMouseEnter() {
    this.setState({ hover: true })
  }

  onMouseLeave() {
    this.setState({ hover: false })
  }

  render() {
    const { children, disabled, style, tooltip } = this.props
    return (
      <div 
        style={Object.assign({}, styles.text, disabled ? styles.disabled : null, styles.hover(this.state.hover), style)}
        onMouseEnter={disabled ? null : this.onMouseEnter}
        onMouseLeave={disabled ? null : this.onMouseLeave}
        onClick={disabled ? null : this.onClick}
        title={tooltip}
      >
        {children}
      </div>
    )
  }
}

const styles = {
  text: {
    color: Colors.whiteout.text.default,
    padding: '0.8rem',
    cursor: 'pointer',
    borderRadius: '0.4rem'
  },
  disabled: {
    opacity: '0.5',
    cursor: 'not-allowed'
  },
  hover: hover => ({
    backgroundColor: hover ? Colors.whiteout.crystal : Colors.whiteout.white
  })
}

TooltipsterDropdownItem.defaultProps = {
  disabled: false,
  style: {},
  tooltip: null,
  onClick: null
}

TooltipsterDropdownItem.propTypes = {
  disabled: PropTypes.bool,
  style: PropTypes.object,
  tooltip: PropTypes.string,

  onClick: PropTypes.func
}
import PropTypes from 'prop-types'
import React from 'react'

const TooltipButtons = ({ children, style }) => {
  return (
    <div style={Object.assign({}, styles.buttons, style)}>
      {children}
    </div>
  )
}

const styles = {
  buttons: {
    marginTop: '1.6rem',
    display: 'flex',
    justifyContent: 'space-between'
  }
}

TooltipButtons.defaultProps = {
  style: {}
}

TooltipButtons.propTypes = {
  style: PropTypes.object
}

export default TooltipButtons

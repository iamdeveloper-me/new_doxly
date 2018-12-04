import PropTypes from 'prop-types'
import React from 'react'

const sizes = ['mini', 'small', null] // in order from smallest to largest
const types = [null, 'primary', 'secondary', 'removal']

const Button = ({ color, icon, disabled, rounded, size, text, tooltip, type, onClick }) => {
  if (rounded && text) {
    console.error('Rounded buttons with text are not supported.')
  }

  const classNames = [
    icon ? `mdi mdi-${icon}` : null,
    rounded ? 'rounded' : null,
    size,
    type ? (type === 'removal' ? type : `button-${type}`) : null
  ].join(' ')

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      title={tooltip}
      style={styles.button(color)}
    >
      {text}
    </button>
  )
}

const styles = {
  button: color => ({
    flexShrink: '0',
    color: color
  })
}

Button.defaultProps = {
  color: null,
  disabled: false,
  rounded: false,
  tooltip: ''
}

Button.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  size: PropTypes.oneOf(sizes),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tooltip: PropTypes.string,
  type: PropTypes.oneOf(types),

  onClick: PropTypes.func
}

export default Button

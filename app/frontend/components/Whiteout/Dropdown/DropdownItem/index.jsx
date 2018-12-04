import PropTypes from 'prop-types'
import React from 'react'

const DropdownItem = ({ active, children, color, disabled, onClick }) => {
  const colorClassName = color ? `company-color before ${color}` : ''

  return (
    <a className={`dropdown-item ${colorClassName}`} style={styles.disabled(disabled)} onClick={disabled ? null : onClick}>
      {children}
      {active ?
        <i className="mdi mdi-check"></i>
      :
        null
      }
    </a>
  )
}

const styles = {
  disabled: disabled => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.5' : '1'
  })
}

DropdownItem.defaultProps = {
  active: false,
  disabled: false
}

DropdownItem.propTypes = {
  active: PropTypes.bool,
  color: PropTypes.string,
  disabled: PropTypes.bool,

  onClick: PropTypes.func
}

export default DropdownItem

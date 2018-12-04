import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const Checkbox = ({ checked, disabled, text, onChange }) => {
  const uniqueId = _.uniqueId()
  return (
    <div style={styles.checkbox} className="control control-checkbox">
      <input
        id={uniqueId}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <label style={styles.label} htmlFor={uniqueId}>
        {text}
      </label>
    </div>
  )
}

const styles = {
  checkbox: {
    lineHeight: 1.4,
    marginBottom: 0
  },
  label: {
    display: 'inline-block'
  }
}

Checkbox.defaultProps = {
  disabled: false,
  text: null
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),

  onChange: PropTypes.func.isRequired
}

export default Checkbox

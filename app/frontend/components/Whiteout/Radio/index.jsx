import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const Radio = ({ checked, disabled, text, onChange }) => {
  const uniqueId = _.uniqueId()
  return (
    <div className="control control-radio">
      <input
        id={uniqueId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={uniqueId}>
        {text}
      </label>
    </div>
  )
}

Radio.defaultProps = {
  disabled: false
}

Radio.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,

  onChange: PropTypes.func.isRequired
}

export default Radio

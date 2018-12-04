import PropTypes from 'prop-types'
import React from 'react'

const sizes = [null, 'medium', 'large']
const heights = [null, 'mini']

const Select = ({disabled, height, identifier, labelText, onChange, optionsArray, size}) => {

  const classNames = ['control control-input', height, size].join(' ')
  const containerWidth = size ? (size === 'medium' ? '32rem' : '69rem') : '18rem'
  const options = optionsArray.map((option, index) => {
    return <option key={index} value={option.value} selected={index === 0} disabled={option.disabled}>{option.text}</option>
  })
  return (
    <div style={styles.selectContainer(containerWidth)}>
      <div className={classNames}>
        {labelText ? <label htmlFor={identifier}>{labelText}</label> : null}
        <select  id={identifier} disabled={disabled} onChange={onChange}>
          {options}
        </select>
      </div>
    </div>

  )
}

const styles = {
  selectContainer: containerWidth => ({
    display: 'block',
    width: containerWidth,
    textAlign: 'left'
  })
}

Select.defaultProps = {
  disabled: false
}

Select.propTypes = {
  disabled: PropTypes.bool,
  height: PropTypes.oneOf(heights),
  identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelText: PropTypes.string,
  optionsArray: PropTypes.array.isRequired,
  size: PropTypes.oneOf(sizes),

  onChange: PropTypes.func.isRequired
}

export default Select

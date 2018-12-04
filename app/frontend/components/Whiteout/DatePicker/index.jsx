import _ from 'lodash'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import PropTypes from 'prop-types'
import React from 'react'

import "react-day-picker/lib/style.css"

const sizes = [null, 'medium', 'large']
const heights = [null, 'mini']

const DatePicker = ({ disabled, height, labelText, onChange, size }) => {
  const uniqueId = _.uniqueId()
  const classNames = ['control control-input', height, size].join(' ')
  const labelElement = labelText ? <label htmlFor={uniqueId}>{labelText}</label> : null

  const containerWidth = size ? (size === 'medium' ? '32rem' : '69rem') : '18rem'
  return (
    <div style={styles.datePickerContainer(containerWidth)}>
      <div style={styles.datePicker} className={classNames}>
        {labelElement}
        <DayPickerInput id={uniqueId} disabled={disabled} type={'text'} style={styles.input} onDayChange={onChange} />
      </div>
    </div>
  )
}

const styles = {
  datePickerContainer: containerWidth => ({
    display: 'block',
    width: containerWidth,
    textAlign: 'left'
  }),
  datePicker: {
    // gets the datepicker div to widen to fill entire container
    // without having to write css for the 'DatePickerInput' class.
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    width: '100%'
  }
}

DatePicker.defaultProps = {
  disabled: false
}

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  height: PropTypes.oneOf(heights),
  labelText: PropTypes.string,
  size: PropTypes.oneOf(sizes),

  onChange: PropTypes.func.isRequired
}

export default DatePicker

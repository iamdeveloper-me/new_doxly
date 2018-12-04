import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const sizes = [null, 'medium', 'large']

const Textarea = ({ autoFocus, disabled, invalid, labelText, placeholder, size, value, onBlur, onChange, onEnter }) => {
  const uniqueId = _.uniqueId()
  const classNames = [
    'control control-input',
    size
  ].join(' ')

  const labelElement = labelText ? <label htmlFor={uniqueId}>{labelText}</label> : null

  let containerWidth = '18rem'
  switch(size) {
    case 'medium':
      containerWidth = '32rem'
      break
    case 'large':
      containerWidth = '69rem'
  }
  return (
    <div style={styles.inputContainer(containerWidth, invalid)}>
      <div className={classNames}>
        {labelElement}
        <textarea
          id={uniqueId}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          onKeyPress={e => e.key === 'Enter' ? onEnter() : null}
          className={invalid ? 'invalid' : null}
          style={styles.textarea}
        />
      </div>
    </div>
  )
}

const styles = {
  inputContainer: (containerWidth, invalid) => ({
    display: 'block',
    maxWidth: containerWidth,
    textAlign: 'left',
    margin: invalid ? '0 0.1rem' : '0'
  }),
  textarea: {
    minHeight: '9rem'
  }
}

Textarea.defaultProps = {
  disabled: false,
  invalid: false,
  labelText: null,
  placeholder: '',
  size: null,
  value: '',

  onBlur: null,
  onEnter: null
}

Textarea.propTypes = {
  disabled: PropTypes.bool,
  labelText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  invalid: PropTypes.bool,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(sizes),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func
}

export default Textarea

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const sizes = [null, 'medium', 'large']
const types = ['text', 'email', 'search', 'number', 'tel', 'url', 'password']
const heights = [null, 'mini']

const Input = ({ autoFocus, disabled, floating, height, includeMargin, icon, iconColor, interactiveIcon, invalid, labelText, placeholder, onBlur, onChange, onEnter, onIconClick, size, style, type, value }) => {

  const uniqueId = _.uniqueId()
  const classNames = [
    'control control-input',
    floating ? 'floating' : null,
    height,
    size
  ].join(' ')

  const iconElement = icon ? <i onClick={onIconClick} style={styles.icon(iconColor, interactiveIcon)} className={`mdi mdi-${icon}`}></i> : null
  const labelElement = labelText ? <label htmlFor={uniqueId}>{labelText}</label> : null

  const containerWidth = size ? (size === 'medium' ? '32rem' : '69rem') : '18rem'
  return (
    <div style={_.assign(styles.inputContainer(containerWidth, invalid), style)}>
      <div className={classNames} style={includeMargin ? null : styles.noMargin}>
        {floating ? null : labelElement}
        {iconElement}
        <input
          autoFocus={autoFocus}
          id={uniqueId}
          type={type}
          name=""
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={onChange}
          required={floating}
          className={invalid ? 'invalid' : null}
          onKeyPress={e => e.key === 'Enter' ? onEnter() : null}
        />
        {floating ? labelElement : null}
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
  icon: (iconColor, interactiveIcon) => ({
    color: iconColor,
    cursor: interactiveIcon ? 'pointer' : 'default'
  }),
  noMargin: {
    marginBottom: '0'
  }
}

Input.defaultProps = {
  autoFocus: false,
  disabled: false,
  floating: false,
  height: null,
  includeMargin: true,
  icon: null,
  iconColor: 'inherit',
  invalid: false,
  labelText: null,
  placeholder: null,
  size: null,
  style: {},
  value: '',

  onBlur: null,
  onChange: null,
  onEnter: null
}

Input.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  floating: PropTypes.bool,
  height: PropTypes.oneOf(heights),
  includeMargin: PropTypes.bool,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  interactiveIcon: PropTypes.bool,
  invalid: PropTypes.bool,
  labelText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(sizes),
  style: PropTypes.object,
  type: PropTypes.oneOf(types).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onIconClick: PropTypes.func
}

export default Input

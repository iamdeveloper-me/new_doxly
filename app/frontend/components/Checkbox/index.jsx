import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

export default class Checkbox extends React.PureComponent {

  render() {
    const { label, value, handleCheckboxChange, isChecked } = this.props
    return (
      <div style={styles.default}>
        <input
          type="checkbox"
          value={value}
          checked={isChecked}
          onChange={() => handleCheckboxChange(value)}
          style={styles.checkbox}
        />
        {label}
      </div>
    )
  }
}

const styles = {
  default: {
    display: 'flex',
    margin: '4px',
    alignItems: 'center'
  },
  checkbox: {
    height: '14px',
    width: '14px',
    marginTop: '0px',
    marginRight: '8px'
  }
}

Checkbox.propTypes = {
  // attributes
  label: PropTypes.element.isRequired,
  isChecked: PropTypes.bool.isRequired,
  value:  PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]),

  // functions
  handleCheckboxChange: PropTypes.func.isRequired
}

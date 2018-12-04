import PropTypes from 'prop-types'
import React from 'react'

const DropdownRow = ({ children, style }) => {
  return (
    <div className="dropdown-row" style={style}>
      {children}
    </div>
  )
}

DropdownRow.defaultProps = {
  style: {}
}

DropdownRow.propTypes= {
  style: PropTypes.object
}

export default DropdownRow

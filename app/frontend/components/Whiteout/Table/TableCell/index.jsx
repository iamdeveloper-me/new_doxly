import PropTypes from 'prop-types'
import React from 'react'

const TableCell = ({ children, style, width }) => {
  return (
    <div style={Object.assign({}, styles.cell(width), style)}>
      {children}
    </div>
  )
}

const styles = {
  cell: width => ({
    paddingRight: '2.0rem',
    width: width,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  })
}

TableCell.defaultProps = {
  style: {}
}

TableCell.propTypes = {
  style: PropTypes.object,
  width: PropTypes.string.isRequired
}

export default TableCell

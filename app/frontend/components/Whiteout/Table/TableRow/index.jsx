import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const TableRow = ({ children, divider, style }) => {
  return (
    <div style={Object.assign({}, styles.row(divider), style)}>
      {children}
    </div>
  )
}

const styles = {
  row: divider => ({
    width: '100%',
    minHeight: '5.0rem',
    display: 'flex',
    alignItems: 'center',
    color: Colors.gray.darkest,
    borderBottom: divider ? `1px solid ${Colors.gray.lightest}` : 'none',
    padding: '0.4rem 0px'
  })
}

TableRow.defaultProps = {
  divider: false,
  style: {}
}

TableRow.propTypes = {
  divider: PropTypes.bool,
  style: PropTypes.object
}

export default TableRow

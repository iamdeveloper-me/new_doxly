import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const TableHeader = ({ children, style }) => {
  return (
    <div
      className="whiteout-table-header-row"
      style={_.assign({}, styles.headers, style)}
    >
      {children}
    </div>
  )
}

const styles = {
  headers: {
    display: 'flex',
    flexShrink: 0,
    paddingBottom: '1.2rem'
  }
}

TableHeader.defaultProps = {
  style: {}
}

TableHeader.propTypes = {
  style: PropTypes.object
}

export default TableHeader

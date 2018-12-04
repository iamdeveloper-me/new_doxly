import PropTypes from 'prop-types'
import React from 'react'

import TableBody from './TableBody/index.jsx'
import TableCell from './TableCell/index.jsx'
import TableHeader from './TableHeader/index.jsx'
import TableRow from './TableRow/index.jsx'

const Table = ({ content, style }) => {
  return (
    <div style={Object.assign({}, styles.table, style)}>
      {content}
    </div>
  )
}

const styles = {
  table: {
    flexGrow: '1',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}

Table.defaultProps = {
  style: {}
}

Table.propTypes = {
  content: PropTypes.element.isRequired,
  style: PropTypes.object
}

export { Table, TableBody, TableCell, TableHeader, TableRow }

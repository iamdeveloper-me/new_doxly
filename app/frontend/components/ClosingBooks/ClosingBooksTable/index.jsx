import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingBookTitle from './ClosingBookTitle/index.jsx'
import Colors from 'helpers/Colors'
import Schema from 'helpers/Schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'components/Whiteout/Table/index.jsx'

const ClosingBooksTable = ({ closingBooks, selectedClosingBookId, selectClosingBook }) => {
  const widths = ['48rem', '16rem', '20rem', '4rem']
  return (
    <div style={styles.container}>
      <Table
        style={styles.table}
        content={
          <div style={styles.tableContainer}>
            <TableHeader>
              <TableCell width={widths[0]} style={styles.closingBookHeader}>
                <h4><FormattedMessage id='closing_books.table.headers.closing_book' /></h4>
              </TableCell>
              <TableCell width={widths[1]} style={styles.header}>
                <h4><FormattedMessage id='closing_books.table.headers.documents' /></h4>
              </TableCell>
              <TableCell width={widths[2]} style={styles.header}>
                <h4><FormattedMessage id='closing_books.table.headers.created' /></h4>
              </TableCell>
            </TableHeader>
            <TableBody style={styles.body}>
              {
                closingBooks.map((closingBook, i) => (
                  <TableRow key={i} style={styles.row} divider={true}>
                    <div
                      className='do-not-hide-sidebar'
                      style={styles.selectedBorder(selectedClosingBookId === closingBook.id)}
                      onClick={() => selectClosingBook(closingBook.id)}
                    >
                      <TableCell width={widths[0]} style={styles.tableCell}>
                        <ClosingBookTitle closingBook={closingBook}/>
                      </TableCell>
                      <TableCell width={widths[1]} style={styles.tableCell}>
                        <div>{closingBook.closing_book_documents.length}</div>
                      </TableCell>
                      <TableCell width={widths[2]} style={styles.tableCell}>
                        <div>{moment(closingBook.created_at).format('MM/DD/YYYY[,] h:mm a')}</div>
                      </TableCell>
                      <TableCell width={widths[3]} style={styles.arrowIcon}>
                        <i className="mdi mdi-chevron-right" style={styles.icon}></i>
                      </TableCell>
                    </div>
                  </TableRow>
                ))
              }
            </TableBody>
          </div>
        }
      />
    </div>
  )
}

const styles = {
  arrowIcon: {
    alignSelf: 'center',
    paddingRight: '2rem'
  },
  icon: {
    color: Colors.button.blue,
    fontSize: '2rem'
  },
  body: {
    background: Colors.white,
    border: `1px solid ${Colors.gray.lightest}`
  },
  closingBookHeader: {
    paddingLeft: '2rem'
  },
  header: {
    padding: '0 0.4rem'
  },
  container: {
    flexGrow: '1',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0px',
    textAlign: 'left',
    overflow: 'hidden',
    color: Colors.text.gray
  },
  row: {
    padding: '0',
    alignItems: 'stretch',
    flexShrink: '0'
  },
  selectedBorder: selected => ({
    display: 'flex',
    border: `1px solid ${selected ? Colors.whiteout.azure : Colors.white}`,
    cursor: 'pointer'
  }),
  table: {
    overflowY: 'auto'
  },
  tableCell: {
    padding: '1.2rem 0.4rem'
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }
}

ClosingBooksTable.defaultProps = {
  selectedClosingBookId: null
}

ClosingBooksTable.propTypes = {
  closingBooks: PropTypes.arrayOf(Schema.closingBook).isRequired,
  selectedClosingBookId: PropTypes.number,

  selectClosingBook: PropTypes.func.isRequired
}

export default ClosingBooksTable

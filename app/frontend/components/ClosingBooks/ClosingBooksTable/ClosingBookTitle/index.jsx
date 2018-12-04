import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'components/Whiteout/Alert/index.jsx'
import Schema from 'helpers/Schema'

const ClosingBookTitle = ({ closingBook }) => {
  let alert = null
  switch(closingBook.status) {
    case 'failed':
      alert = (
        <div style={styles.alert}>
          <Alert
            status='error'
            messageTitle={<FormattedMessage id='closing_books.table.alerts.error' />}
            message={<FormattedMessage id='closing_books.table.alerts.error_message' />}
          />
        </div>
      )
      break
    case 'in_progress':
      alert = (
        <div style={styles.alert}>
          <Alert
            messageTitle={<FormattedMessage id='closing_books.table.alerts.in_progress' />}
            message={<FormattedMessage id='closing_books.table.alerts.in_progress_message' />}
          />
        </div>
      )
  }
  return (
    <div style={styles.container}>
      <div>{closingBook.name}</div>
      {closingBook.description ? <div className='gray' style={styles.description}>{closingBook.description}</div> : null}
      {alert}
    </div>
  )
}

const styles = {
  alert: {
    paddingTop: '1rem'
  },
  container: {
    paddingLeft: '1.6rem'
  },
  description: {
    marginTop: '.4rem'
  }
}
ClosingBookTitle.propTypes = {
  closingBook: Schema.closingBook.isRequired
}

export default ClosingBookTitle

import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'

const ClosingBooksEmptyState = ({ toggleCreateWizard }) => (
  <div style={styles.container}>
    <i style={styles.icon} className="mdi mdi-book-open"></i>
    <h1 style={styles.title}><FormattedMessage id="closing_books.empty_state.create_a_closing_book" /></h1>
    <p style={styles.details}><FormattedMessage id="closing_books.empty_state.prepare_and_assemble" /></p>
    <Button
      type='primary'
      text={<FormattedMessage id="closing_books.empty_state.create_closing_book" />}
      onClick={toggleCreateWizard}
    />
  </div>
)

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  icon: {
    fontSize: '6.4rem'
  },
  title: {
    marginTop: '0.4rem'
  },
  details: {
    margin: '0.8rem 0 3.2rem 0',
    width: '25rem',
    textAlign: 'center'
  }
}

ClosingBooksEmptyState.propTypes = {
  toggleCreateWizard: PropTypes.func.isRequired
}

export default ClosingBooksEmptyState
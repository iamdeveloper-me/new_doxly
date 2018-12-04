import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'

const ClosingBooksToolbar = ({ toggleCreateWizard }) => (
  <div className='whiteout-ui' style={styles.content}>
    <Button
      text={<FormattedMessage id="closing_books.toolbar.create_closing_book" />}
      type='primary'
      onClick={toggleCreateWizard}
    />
  </div>
)

const styles = {
  content: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '20px 0 0 0',
    flexShrink: '0'
  }
}
ClosingBooksToolbar.propTypes = {
  toggleCreateWizard: PropTypes.func.isRequired
}

export default ClosingBooksToolbar

import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Schema from 'helpers/Schema'

class ClosingBookDocument extends React.PureComponent {

  render() {
    const { closingBookDocument } = this.props
    const errorMessage =  !_.isEmpty(closingBookDocument.critical_errors) ?
                            <div className='note' style={styles.error}>
                              <FormattedMessage id='closing_books.sidebar.document_error' />
                            </div>
                          :
                            null
    return (
      <div style={styles.row}>
        <div>{closingBookDocument.name}</div>
        {errorMessage}
      </div>
    )
  }
}

const styles = {
  error: {
    marginTop: '0.4rem',
    color: Colors.whiteout.carmine
  },
  row: {
    padding: '1.2rem',
    borderBottom: `.1rem solid ${Colors.gray.lightest}`,
    wordWrap: 'break-word'
  }
}

ClosingBookDocument.propTypes = {
  closingBookDocument: PropTypes.object.isRequired
}

export default ClosingBookDocument

import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingBookDocument from '../ClosingBookDocument/index.jsx'
import Colors from 'helpers/Colors'
import Schema from 'helpers/Schema'

class ClosingBookErrors extends React.PureComponent {

  render() {
    const { closingBookDocumentsWithErrors } = this.props
    const numberOfErrors = closingBookDocumentsWithErrors.length
    if (numberOfErrors > 0) {
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h4>
              <FormattedMessage
                id='closing_books.sidebar.content.errors_header'
                values={{numberOfErrors: numberOfErrors}}
              />
            </h4>
          </div>
          <div style={styles.closingBookDocumentsWithErrors}>
            {closingBookDocumentsWithErrors.map(closingBookDocument => (
              <ClosingBookDocument
                key={closingBookDocument.id}
                closingBookDocument={closingBookDocument}
              />
            ))}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const styles = {
  closingBookDocumentsWithErrors: {
    background: Colors.white,
    display:'flex',
    flexDirection: 'column',
    flexGrow: '1',
    width: '100%',
    overflow: 'auto',
    borderTop: `.1rem solid ${Colors.gray.lightest}`
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflow: 'hidden'
  },
  header: {
    padding: '2.4rem 0 .8rem 1.2rem',
    flexShrink: '0'
  }
}

ClosingBookErrors.propTypes = {
  closingBookDocumentsWithErrors: PropTypes.array.isRequired
}

export default ClosingBookErrors

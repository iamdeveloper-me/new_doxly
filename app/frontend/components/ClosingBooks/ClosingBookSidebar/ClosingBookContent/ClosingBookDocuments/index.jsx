import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import ClosingBookDocument from '../ClosingBookDocument/index.jsx'
import Colors from 'helpers/Colors'
import Schema from 'helpers/Schema'

class ClosingBookDocuments extends React.PureComponent {

  render() {
    const { closingBookDocuments } = this.props
    const numberOfDocuments = closingBookDocuments.length
    if (numberOfDocuments > 0) {
      return (
        <div style={styles.container}>
          <div style={styles.header}>
            <h4>
              <FormattedMessage
                id='closing_books.sidebar.content.documents_header'
                values={{numberOfDocuments: numberOfDocuments}}
              />
            </h4>
          </div>
          <div style={styles.closingBookDocuments}>
            {_.sortBy(closingBookDocuments, 'tab_number').map(closingBookDocument => (
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
  closingBookDocuments: {
    background: Colors.white,
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

ClosingBookDocuments.propTypes = {
  closingBookDocuments: PropTypes.array.isRequired
}

export default ClosingBookDocuments

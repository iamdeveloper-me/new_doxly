import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import DocumentIssue from './DocumentIssue/index.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'components/Whiteout/Table/index.jsx'

const IncompleteDocuments = ({ documents }) => {
  const widths = ['70%', '30%']

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FormattedMessage id='executed_versions.incomplete_documents' />
      </div>
      <Table
        style={styles.table}
        content={
          <div style={styles.table}>
            <TableHeader>
              <TableCell width={widths[0]}>
                <h4><FormattedMessage id='executed_versions.document_header' /></h4>
              </TableCell>
              <TableCell width={widths[1]}>
                <h4><FormattedMessage id='executed_versions.issue' /></h4>
              </TableCell>
            </TableHeader>
            <TableBody>
              {
                documents.map((document, i) => (
                  <TableRow key={i} divider={true}>
                    <TableCell width={widths[0]}>
                      {document.document_name}
                    </TableCell>
                    <TableCell width={widths[1]}>
                      {
                        document.issue.map((issue, i) => (
                          <DocumentIssue key={i} issue={issue} />
                        ))
                      }
                    </TableCell>
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
  container: {
    flexGrow: '1',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingTop: '2.0rem',
    textAlign: 'left',
    color: Colors.text.gray
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    flexShrink: 0,
    paddingBottom: '2.0rem'
  },
  questionIcon: {
    color: Colors.button.blue,
    marginLeft: '0.4rem',
    cursor: 'pointer'
  }
}

IncompleteDocuments.propTypes = {
  documents: PropTypes.array.isRequired
}

export default IncompleteDocuments

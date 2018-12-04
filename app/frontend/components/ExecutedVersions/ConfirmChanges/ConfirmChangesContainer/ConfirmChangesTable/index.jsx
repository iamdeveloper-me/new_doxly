import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'components/Whiteout/Table/index.jsx'

export default class ConfirmChangesTable extends React.PureComponent {

  render() {
    const { documents } = this.props
    const widths = ['60%', '40%']

    return (
      <Table
        style={styles.table}
        content={
          <div style={styles.table}>
            <TableHeader>
              <TableCell width={widths[0]}>
                <h4><FormattedMessage id='executed_versions.document_header' /></h4>
              </TableCell>
              <TableCell width={widths[1]}>
                <h4><FormattedMessage id='executed_versions.edits' /></h4>
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
                      {document.changes}
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </div>
        }
      />
    )
  }

}

const styles = {
  table: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }
}

ConfirmChangesTable.propTypes = {
  documents: PropTypes.array.isRequired
}

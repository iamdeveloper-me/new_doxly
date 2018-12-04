import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Checkbox from 'components/Whiteout/Checkbox/index.jsx'
import DocumentCheckbox from './DocumentCheckbox/index.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'components/Whiteout/Table/index.jsx'

export default class ReadyDocuments extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleSelectAll = this.handleSelectAll.bind(this)
  }

  handleSelectAll() {
    const { documents, selectedDocuments } = this.props
    const { setSelectedDocuments } = this.props

    if (documents.length === selectedDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents)
    }
  }

  render() {
    const { documents, selectedDocuments, updateSelectedDocuments } = this.props
    const allChecked = documents.length === selectedDocuments.length
    const widths = ['50%', '16%', '16%', '16%']

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <FormattedMessage id='executed_versions.ready_documents' />
        </div>
        <Table
          style={styles.table}
          content={
            <div style={styles.table}>
              <TableHeader>
                <TableCell width={widths[0]}>
                  <Checkbox
                    checked={allChecked}
                    onChange={this.handleSelectAll}
                    text={<h4><FormattedMessage id='executed_versions.select_all_documents' /></h4>}
                  />
                </TableCell>
                <TableCell width={widths[1]}>
                  <h4><FormattedMessage id='executed_versions.status' /></h4>
                </TableCell>
                <TableCell width={widths[2]}>
                  <h4><FormattedMessage id='executed_versions.signatures' /></h4>
                </TableCell>
                <TableCell width={widths[3]}>
                  <h4><FormattedMessage id='executed_versions.new_signers_header' /></h4>
                </TableCell>
              </TableHeader>
              <TableBody>
                {
                  documents.map((document, i) => (
                    <TableRow key={i} divider={true}>
                      <TableCell width={widths[0]}>
                        <DocumentCheckbox
                          key={`document-list-${document.document_id}`}
                          document={document}
                          updateSelectedDocuments={updateSelectedDocuments}
                          selectedDocuments={selectedDocuments}
                        />
                      </TableCell>
                      <TableCell width={widths[1]}>
                        {_.capitalize(document.document_status)}
                      </TableCell>
                      <TableCell width={widths[1]}>
                        {document.voting_threshold_required ?
                          <FormattedMessage
                            id={
                              document.threshold_met ? 
                                'executed_versions.threshold_met'
                              :
                                'executed_versions.threshold_not_met'
                              }
                            />
                        :
                          `${document.pages_signed_or_executed} of ${document.total_signers}`
                        }
                      </TableCell>
                      <TableCell width={widths[1]}>
                        {document.new_signers.length}
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

}

const styles = {
  container: {
    flexGrow: '1',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '2.0rem 0px',
    textAlign: 'left',
    overflow: 'hidden',
    color: Colors.text.gray
  },
  header: {
    flexShrink: 0,
    marginBottom: '3.2rem'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  selectAll: {
    display: 'flex',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: Colors.gray.normal
  },
  checkbox: {
    cursor: 'pointer'
  },
  text: {
    paddingLeft: '.8rem'
  }
}

ReadyDocuments.propTypes = {
  documents: PropTypes.array.isRequired,
  selectedDocuments: PropTypes.array.isRequired,

  setSelectedDocuments: PropTypes.func.isRequired,
  updateSelectedDocuments: PropTypes.func.isRequired
}

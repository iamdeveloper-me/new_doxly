import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import AddReviewAttachment from './AddReviewAttachment/index.jsx'
import Colors from 'helpers/Colors'
import DocumentInformation from './DocumentInformation/index.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader
} from 'components/Whiteout/Table/index.jsx'
import {
  Tooltip,
  TooltipHeader
} from 'components/Whiteout/Tooltip/index.jsx'

class AddSignaturePacketReviewDocuments extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false
    }
    this.shouldScrollBottom = false
    this.hideTooltip = this.hideTooltip.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
    this.getDocumentInformationComponents = this.getDocumentInformationComponents.bind(this)
  }

  componentWillUpdate(nextProps) {
    this.shouldScrollBottom = nextProps.signaturePacketReviewDocuments.length > this.props.signaturePacketReviewDocuments.length
  }

  showTooltip() {
    this.setState({ showTooltip: true })
  }

  hideTooltip() {
    this.setState({ showTooltip: false })
  }

  getDocumentInformationComponents() {
    const { onlySignaturePagesIds, signaturePacketReviewDocuments, signaturePages } = this.props
    const { onRemove, onSignatureOnly } = this.props
    const nonSignaturePageSignaturePacketReviewDocuments =  signaturePacketReviewDocuments.filter(signaturePacketReviewDocument => (signaturePacketReviewDocument.type !== 'signature_page'))
    let documentInformationComponents = []

    // build the ones that correspond to signature pages.
    _.each(signaturePages, signaturePage => {
      let treeElement = signaturePage.signature_page_collection.tree_element_signature_group.tree_element
      let index = _.findIndex(signaturePacketReviewDocuments, { tree_element_id: treeElement.id })

      documentInformationComponents.push(
        <DocumentInformation
          key={_.uniqueId()}
          signaturePacketDocument={signaturePacketReviewDocuments[index]}
          type='signature_page'
          onlySignaturePagesIds={onlySignaturePagesIds}
          onSignatureOnly={onSignatureOnly}
          onRemove={onRemove}
          number_of_copies={treeElement.number_of_signature_page_copies}
        />
      )
    })

    // build the ones that don't correspond to signature pages (i.e. they dissappear if remove button is hit)
    _.each(nonSignaturePageSignaturePacketReviewDocuments, signaturePacketReviewDocument => {
      documentInformationComponents.push(
        <DocumentInformation
          key={_.uniqueId()}
          signaturePacketDocument={signaturePacketReviewDocument}
          type={signaturePacketReviewDocument.type}
          onlySignaturePagesIds={onlySignaturePagesIds}
          onSignatureOnly={onSignatureOnly}
          onRemove={onRemove}
        />
      )
    })
    return documentInformationComponents
  }

  render() {
    const { intl, packetsCount, pagesType, signaturePacketReviewDocuments } = this.props
    const { createSignaturePacketReviewDocumentFromChecklist, createSignaturePacketReviewDocumentFromUploads } = this.props
    const widths = ['10%', '45%', '20%', '25%']

    return (
      <div style={styles.container}>
        <h3 style={styles.title}>
          <FormattedMessage
            id='send_signature_packets.add_signature_packet_review_documents.packet_title'
            values= {{
              packetsCount: packetsCount,
              pagesType: _.capitalize(pagesType)
            }}
          />
        </h3>
        <Table
          content={
            <div>
              <TableHeader style={styles.header}>
                <TableCell width={widths[0]}></TableCell>
                <TableCell width={widths[1]}>
                  <h4><FormattedMessage id='send_signature_packets.add_signature_packet_review_documents.doc' /></h4>
                </TableCell>
                <TableCell width={widths[2]}></TableCell>
                <TableCell width={widths[3]}>
                  <div style={styles.sigHeader}>
                    <h4><FormattedMessage id='send_signature_packets.add_signature_packet_review_documents.signature_only' /></h4>
                    <Tooltip
                      position='bottom'
                      hideTooltip={this.hideTooltip}
                      showTooltip={this.state.showTooltip}
                      content={
                        <TooltipHeader>
                          {intl.formatMessage({id: 'send_signature_packets.add_signature_packet_review_documents.send_without_signature_pages'})}
                        </TooltipHeader>
                      }
                      trigger={
                        <div
                          className="mdi mdi-help-circle-outline"
                          style={styles.icon}
                          onMouseEnter={this.showTooltip}
                          onMouseLeave={this.hideTooltip}
                        >
                        </div>
                      }
                    />
                    </div>
                  </TableCell>
                </TableHeader>
                <TableBody style={styles.tableBody} shouldScrollBottom={this.shouldScrollBottom}>
                  {this.getDocumentInformationComponents()}
                </TableBody>
              </div>
            }
          />
        <AddReviewAttachment
          signaturePacketReviewDocuments={signaturePacketReviewDocuments}
          createSignaturePacketReviewDocumentFromChecklist={createSignaturePacketReviewDocumentFromChecklist}
          createSignaturePacketReviewDocumentFromUploads={createSignaturePacketReviewDocumentFromUploads}
        />
      </div>
    )
  }
}

const styles = {
  title: {
    margin: '3.2rem 0 1.6rem 3.2rem'
  },
  header: {
    padding: '0.8rem 0',
    display: 'flex',
    alignItems: 'center',
    borderTop: `0.1rem solid ${Colors.whiteout.gray}`,
    borderBottom: `0.1rem solid ${Colors.whiteout.gray}`
  },
  sigHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    paddingLeft: '0.4rem',
    color: Colors.whiteout.blue,
    cursor: 'pointer'
  },
  tableBody: {
    height: '30rem',
    borderBottom: `0.1rem solid ${Colors.whiteout.gray}`
  }
}

AddSignaturePacketReviewDocuments.propTypes = {
  intl: intlShape.isRequired,
  onlySignaturePagesIds: PropTypes.array.isRequired,
  packetsCount: PropTypes.number.isRequired,
  pagesType: PropTypes.string.isRequired,
  signaturePacketReviewDocuments: PropTypes.array.isRequired,
  signaturePages: PropTypes.array.isRequired,

  createSignaturePacketReviewDocumentFromChecklist: PropTypes.func.isRequired,
  createSignaturePacketReviewDocumentFromUploads: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSignatureOnly: PropTypes.func.isRequired
}

export default injectIntl(AddSignaturePacketReviewDocuments)

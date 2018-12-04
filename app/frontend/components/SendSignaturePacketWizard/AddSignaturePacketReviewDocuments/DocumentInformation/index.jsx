import _ from 'lodash'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Checkbox from 'components/Whiteout/Checkbox/index.jsx'
import Colors from 'helpers/Colors'
import {
  TableCell,
  TableRow
} from 'components/Whiteout/Table/index.jsx'
import {
  Tooltip,
  TooltipHeader
} from 'components/Whiteout/Tooltip/index.jsx'

const types = ['error', 'checklist', 'signature_page', 'upload', 'uploading']

class DocumentInformation extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showTooltip: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.getLeftCell = this.getLeftCell.bind(this)
    this.getRightCell = this.getRightCell.bind(this)
    this.getNameAndDetails = this.getNameAndDetails.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  showTooltip() {
    this.setState({ showTooltip: true })
  }

  hideTooltip() {
    this.setState({ showTooltip: false })
  }

  getLeftCell(type) {
    switch(type) {
      case 'signature_page':
        return null
      case 'error':
        return <i style={styles.error} className="mdi mdi-alert-circle mdi-24px"></i>
      default:
        return (
          <Tooltip
            position='bottom'
            hideTooltip={this.hideTooltip}
            showTooltip={this.state.showTooltip}
            content={
              <TooltipHeader>
                <p>{this.props.intl.formatMessage({id: 'send_signature_packets.add_signature_packet_review_documents.attached_for_review'})}</p>
              </TooltipHeader>
            }
            trigger={
              <div
                className="mdi mdi-18px mdi-paperclip"
                onMouseEnter={this.showTooltip}
                onMouseLeave={this.hideTooltip}
              >
              </div>
            }
          />
        )
    }
  }

  getRightCell(type) {
    const { onlySignaturePagesIds, signaturePacketDocument} = this.props
    const { onSignatureOnly } = this.props

    switch(type) {
      case 'signature_page':
        return (
          <div style={styles.checkbox}>
            <Checkbox
              checked={_.includes(onlySignaturePagesIds, signaturePacketDocument.tree_element_id)}
              onChange={() => onSignatureOnly(signaturePacketDocument, onlySignaturePagesIds)}
            />
          </div>
        )
      case 'uploading':
        return (
          <div style={styles.spinnerContainer}>
            <div style={styles.uploadingSpinner}></div>
          </div>
        )
    }
  }

  getNameAndDetails(signaturePacketDocument, type) {
    switch(type) {
      // signature_page and checklist get the same content
      case 'signature_page':
      case 'checklist':
        return (
          <div>
            <FormattedMessage
              id="send_signature_packets.add_signature_packet_review_documents.document_name"
              values={{
                name: signaturePacketDocument.name,
                number_of_copies: this.props.number_of_copies
              }}
            />
            <div style={styles.checklistDetails}>
              {signaturePacketDocument.version_position ?
                <FormattedMessage
                  id="send_signature_packets.add_signature_packet_review_documents.version_from_closing_checklist"
                  values={{
                    version_position: signaturePacketDocument.version_position
                  }}
                />
              :
                null
              }
            </div>
          </div>
        )
      case 'upload':
        return (
          <div>
            {signaturePacketDocument.tempUpload.file_name}
            <div style={styles.uploadsDetails}>
              <FormattedMessage
                id="send_signature_packets.add_signature_packet_review_documents.upload_details"
                values={{
                  datetime: moment(signaturePacketDocument.tempUpload.created_at).format('MM/DD/YYYY, h:mm a'),
                  usersname: signaturePacketDocument.tempUpload.user.name
                }}
              />
            </div>
          </div>
        )
      case 'uploading':
        return (
          <div>
            {signaturePacketDocument.file.name}
            <div style={styles.uploadsDetails}>
              <FormattedMessage
                id="send_signature_packets.add_signature_packet_review_documents.uploading_details"
              />
            </div>
          </div>
        )
      case 'error':
        return (
          <div>
            {signaturePacketDocument.file.name}
            <div style={styles.error}>
              <FormattedMessage
                id="send_signature_packets.add_signature_packet_review_documents.upload_failed"
                values={{
                  support: <a style={styles.supportLink} href="mailto:support@doxly.com">contact support</a>
                }}
              />
            </div>
          </div>
        )
    }
  }

  render() {
    const { signaturePacketDocument, type } = this.props
    const { onRemove } = this.props
    const widths = ['10%', '45%', '20%', '25%']

    return (
      <div onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} style={styles.row}>
        <TableRow divider={true}>
          <TableCell width={widths[0]} style={styles.icon}>
            {this.getLeftCell(type)}
          </TableCell>
          <TableCell width={widths[1]}>
            {this.getNameAndDetails(signaturePacketDocument, type)}
          </TableCell>
          <TableCell width={widths[2]} style={styles.button}>
            {(this.state.hover && type !== 'signature_page') ?
              <Button
                icon='delete'
                type='secondary'
                text={<FormattedMessage id='buttons.remove' />}
                size='mini'
                onClick={() => onRemove(signaturePacketDocument)}
              />
            :
              null
            }
          </TableCell>
          <TableCell width={widths[3]}>
            {this.getRightCell(type)}
          </TableCell>
        </TableRow>
      </div>
    )
  }
}

const styles = {
  icon: {
    display: 'flex',
    justifyContent: 'flex-end',
    overflow: 'show',
    cursor: 'pointer'
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
    overflow: 'visible'
  },
  checkbox: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  details: hasDetails => ({
    paddingTop: '.4rem',
    color: Colors.whiteout.text.light,
    display: hasDetails ? 'flex' : null
  }),
  checklistDetails: {
    paddingTop: '.4rem',
    color: Colors.whiteout.text.light
  },
  uploadsDetails: {
    paddingTop: '.4rem',
    color: Colors.whiteout.text.light,
    display: 'flex'
  },
  error: {
    color: Colors.whiteout.alert.error
  },
  row: {
    flexShrink: '0'
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  uploadingSpinner: {
    border: `.2rem solid ${Colors.gray.lighter}`,
    borderRadius: '50%',
    height: '1.8rem',
    width: '1.8rem',
    borderTop: `.2rem solid ${Colors.blue.dark}`,
    animation: 'spin 1s linear infinite'
  }
}
DocumentInformation.defaultProps = {
  number_of_copies: 1
}

DocumentInformation.propTypes = {
  intl: intlShape.isRequired,
  number_of_copies: PropTypes.number,
  onlySignaturePagesIds: PropTypes.array.isRequired,
  signaturePacketDocument: PropTypes.object.isRequired,
  type: PropTypes.oneOf(types),

  onRemove: PropTypes.func.isRequired,
  onSignatureOnly: PropTypes.func.isRequired
}

export default injectIntl(DocumentInformation)

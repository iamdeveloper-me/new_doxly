import Dropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Colors from 'helpers/Colors'
import { Dropdown } from 'components/Whiteout/Dropdown/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'
import Section from './Section/index.jsx'

export default class AddReviewAttachment extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      closingChecklistSections: []
    }
    this.getClosingChecklist = this.getClosingChecklist.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.openFilePicker = this.openFilePicker.bind(this)
  }

  openFilePicker() {
    this.dropzone.open()
  }

  onDrop(files) {
    this.props.createSignaturePacketReviewDocumentFromUploads(files)
  }

  getClosingChecklist() {
    const params = Params.fetch()
    Api.get(Routes.dealClosingChecklist(params.deals, ['attachment.latest_version']))
      .then((closingChecklistArray) => {
        const closingChecklistSections = closingChecklistArray[0].children
        this.setState({
          loading: false,
          closingChecklistSections
        })
      })
  }

  render(){
    const { closingChecklistSections } = this.state
    const { signaturePacketReviewDocuments } = this.props
    const { createSignaturePacketReviewDocumentFromChecklist } = this.props

    const content = this.state.loading ? (
      <LoadingSpinner showLoadingBox={false} showLoadingText={false} />
    ) : (
      <div style={styles.body}>
        {closingChecklistSections.map((section, index) => (
          <Section
            key={index}
            section={section}
            indentation={0}
            signaturePacketReviewDocuments={signaturePacketReviewDocuments}
            createSignaturePacketReviewDocumentFromChecklist={createSignaturePacketReviewDocumentFromChecklist}
          />
        ))}
      </div>
    )
    const checklistDropdown = (
      <div style={styles.inline}>
        <Dropdown
          trigger={
            <span style={styles.closingChecklist} onClick={this.getClosingChecklist}>
              <FormattedMessage id='send_signature_packets.add_signature_packet_review_documents.closing_checklist' />
            </span>
          }
          content={content}
          interactive={true}
          caret={true}
          right={true}
        />
      </div>
    )

    const fileUpload = (
      <div style={styles.inline}>
        <Dropzone
          onDrop={this.onDrop}
          ref={dropzone => { this.dropzone = dropzone }}
          disableClick={true}
          style={{}}
        >
          <div onClick={this.openFilePicker} style={styles.uploadFileLink}>
            <FormattedMessage id='send_signature_packets.add_signature_packet_review_documents.upload_file' />
          </div>
        </Dropzone>
      </div>
    )

    return (
      <div className="mdi mdi-paperclip" style={styles.addLink}>
        <FormattedMessage
          id='send_signature_packets.add_signature_packet_review_documents.add_attachment_from'
          values={{
            dropdown: checklistDropdown,
            uploadFile: fileUpload
          }}
        />
      </div>

    )
  }
}

const styles = {
  body: {
    height: '36rem',
    width: '56rem',
    overflow: 'auto',
    margin: '1.6rem 0',
    borderBottom: `.1rem solid ${Colors.whiteout.status.gray}`,
    borderTop: `.1rem solid ${Colors.whiteout.status.gray}`
  },
  closingChecklist: {
    color: Colors.whiteout.blue,
    cursor: 'pointer',
    fontWeight: 500
  },
  addLink: {
    fontSize: '1.6rem',
    marginTop: '1.2rem',
    display: 'flex',
    marginLeft: '3.2rem'
  },
  uploadFileLink: {
    color: Colors.whiteout.blue,
    cursor: 'pointer',
    fontWeight: 500
  },
  inline: {
    display: 'inline-block'
  }
}

AddReviewAttachment.propTypes = {
  signaturePacketReviewDocuments: PropTypes.array.isRequired,

  createSignaturePacketReviewDocumentFromChecklist: PropTypes.func.isRequired,
  createSignaturePacketReviewDocumentFromUploads: PropTypes.func.isRequired
}

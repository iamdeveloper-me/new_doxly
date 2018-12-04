import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import WhiteoutPdfViewer from 'components/WhiteoutPdfViewer/index.jsx'

export default class ManuallyMatchedPage extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showDocumentViewer: false
    }
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
  }

  openDocumentViewer() {
    this.setState({ showDocumentViewer: true })
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  render() {
    const { signaturePages, signers, treeElements, manuallyMatchedSignatureUploadPage, unmatchedSignatureUploads } = this.props
    const { undoManuallyMatched } = this.props

    const unmatchedSignatureUpload = unmatchedSignatureUploads[manuallyMatchedSignatureUploadPage.unmatched_signature_upload_id]
    const signaturePage = signaturePages[manuallyMatchedSignatureUploadPage.signature_page]
    const signer = signers[signaturePage.signer]
    const treeElement = treeElements[signaturePage.tree_element]
    const pageNumber = (
      <FormattedMessage
        id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.page_number'
        values={{
          page_number: manuallyMatchedSignatureUploadPage.page_number
        }}
      />
    )

    return(
      <div style={styles.content}>
        <div style={styles.infoBox}>
          <div style={styles.info}>
            <div style={styles.fileName}>
              <a onClick={this.openDocumentViewer} style={styles.link}>
                <FormattedMessage
                  id='unmatched_signature_pages.sidebar.manually_matched_tab.file_name'
                  values={{
                    file_name: unmatchedSignatureUpload.file_name,
                    page_number: manuallyMatchedSignatureUploadPage.page_number
                  }}
                />
              </a>
            </div>
            <div style={styles.placed}><h4><FormattedMessage id='unmatched_signature_pages.sidebar.manually_matched_tab.placed'/></h4></div>
            <div className="gray" style={styles.signer}>{signer.name}</div>
            <div className="gray" style={styles.treeElement}>{treeElement.name}</div>
          </div>
          <div style={styles.button}>
            <Button
              type="secondary"
              size="mini"
              icon="undo-variant"
              disabled={signaturePage.currently_executed}
              onClick={() => undoManuallyMatched(unmatchedSignatureUpload.id, manuallyMatchedSignatureUploadPage.id)}
            />
          </div>
        </div>
        {this.state.showDocumentViewer ?
          <WhiteoutPdfViewer
            title={pageNumber}
            pagePath={manuallyMatchedSignatureUploadPage.url}
            onClose={this.hideDocumentViewer}
          />
        :
          null
        }
      </div>
    )
  }
}

const styles = {
  button: {
    paddingRight: '1.2rem',
    paddingLeft: '0.8rem',
    flexShrink: '0'
  },
  infoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  info: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  fileName: {
    display: 'flex',
    padding: '1.2rem 1.2rem 0.8rem 1.2rem',
    fontSize: '1.2rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  content: {
    background: Colors.white,
    display: 'flex',
    flexGrow: '1',
    width: '100%',
    overflow: 'auto',
    borderTop: `.1rem solid ${Colors.gray.lightest}`,
    flexDirection: 'column'
  },
  placed: {
    display: 'flex',
    paddingLeft: '1.2rem'
  },
  signer: {
    paddingLeft: '1.2rem',
    paddingTop: '.4rem',
    fontSize: '1.2rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  treeElement: {
    paddingLeft: '1.2rem',
    paddingBottom: '.8rem',
    fontSize: '1.2rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  link: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
}

ManuallyMatchedPage.propTypes = {
  manuallyMatchedSignatureUploadPage: PropTypes.object.isRequired,
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.object.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUploads: PropTypes.object.isRequired,

  undoManuallyMatched: PropTypes.func.isRequired
}

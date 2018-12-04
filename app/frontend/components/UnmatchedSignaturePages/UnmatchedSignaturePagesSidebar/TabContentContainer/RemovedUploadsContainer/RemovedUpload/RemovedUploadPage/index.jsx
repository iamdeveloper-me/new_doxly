import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import WhiteoutPdfViewer from 'components/WhiteoutPdfViewer/index.jsx'

export default class RemovedUploadPage extends React.PureComponent {

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
    const { removedUploadPage } = this.props
    const pageNumber = (
      <FormattedMessage
        id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.unmatched_signature_upload_page.page_number'
        values={{
          page_number: removedUploadPage.page_number
        }}
      />
    )

    return(
      <div style={styles.content}>
        <div>
          <a onClick={this.openDocumentViewer}>
            {pageNumber}
          </a>
        </div>
        {this.state.showDocumentViewer ?
          <WhiteoutPdfViewer
            title={pageNumber}
            pagePath={removedUploadPage.url}
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
  content: {
    flexGrow: '1',
    background: Colors.white,
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBottom: '.4rem'
  }
}

RemovedUploadPage.propTypes = {
  removedUploadPage: PropTypes.object.isRequired
}

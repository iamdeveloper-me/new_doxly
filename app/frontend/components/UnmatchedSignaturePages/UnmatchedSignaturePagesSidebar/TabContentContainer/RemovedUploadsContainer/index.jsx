import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import RemovedUpload from './RemovedUpload/index.jsx'

export default class RemovedUploadsContainer extends React.PureComponent {

  render() {
    const { unmatchedSignatureUploads, unmatchedSignatureUploadPages } = this.props
    const { undoRemovedUpload } = this.props
    const unmatchedSignatureUploadsWithRemovedPages = _.filter(unmatchedSignatureUploads, unmatchedSignatureUpload => (
      _.some(unmatchedSignatureUpload.unmatched_signature_upload_pages.map(unmatchedSignatureUploadPageId => unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]), unmatchedSignatureUploadPage => (
        unmatchedSignatureUploadPage.status === 'removed'
      ))
    ))
    const sortedUnmatchedSignatureUploadsWithRemovedPages = _.orderBy(unmatchedSignatureUploadsWithRemovedPages, 'created_at', 'desc')

    return(
      <div style={styles.content}>
        {_.map(sortedUnmatchedSignatureUploadsWithRemovedPages, unmatchedSignatureUploadWithRemovedPages =>(
          <RemovedUpload
            key={unmatchedSignatureUploadWithRemovedPages.id}
            removedUpload={unmatchedSignatureUploadWithRemovedPages}
            unmatchedSignatureUploadPages={unmatchedSignatureUploadPages}
            undoRemovedUpload={undoRemovedUpload}
          />
        ))}
      </div>
    )
  }
}

const styles = {
  content: {
    flexGrow: '1',
    background: Colors.white,
    border: `0.1rem solid ${Colors.whiteout.gray}`,
    borderRadius: '0.4rem',
    overflowX: 'hidden',
    overflowY: 'auto',
    marginTop: '1rem'
  }
}

RemovedUploadsContainer.propTypes = {
  unmatchedSignatureUploads: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  undoRemovedUpload: PropTypes.func.isRequired
}

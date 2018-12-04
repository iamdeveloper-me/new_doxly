import PropTypes from 'prop-types'
import React from 'react'

import ManuallyMatchedContainer from './ManuallyMatchedContainer/index.jsx'
import RemovedUploadsContainer from './RemovedUploadsContainer/index.jsx'

export default class TabContentContainer extends React.PureComponent {

  render() {
    const { selectedTab, signaturePages, signers, treeElements, unmatchedSignatureUploads, unmatchedSignatureUploadPages } = this.props
    const { undoManuallyMatched, undoRemovedUpload } = this.props

    switch (selectedTab) {
      case 'manually_matched':
        return (
          <ManuallyMatchedContainer
            signaturePages={signaturePages}
            signers={signers}
            treeElements={treeElements}
            unmatchedSignatureUploads={unmatchedSignatureUploads}
            unmatchedSignatureUploadPages={unmatchedSignatureUploadPages}
            undoManuallyMatched={undoManuallyMatched}
          />
        )
      case 'removed_uploads':
        return (
          <RemovedUploadsContainer
            unmatchedSignatureUploads={unmatchedSignatureUploads}
            unmatchedSignatureUploadPages={unmatchedSignatureUploadPages}
            undoRemovedUpload={undoRemovedUpload}
          />
        )
    }
  }
}

TabContentContainer.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.object.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUploads: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  undoManuallyMatched: PropTypes.func.isRequired,
  undoRemovedUpload: PropTypes.func.isRequired
}

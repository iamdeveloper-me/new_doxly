import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import ManuallyMatchedPage from './ManuallyMatchedPage/index.jsx'

export default class ManuallyMatchedContainer extends React.PureComponent {

  render() {
    const { signaturePages, signers, treeElements, unmatchedSignatureUploads, unmatchedSignatureUploadPages } = this.props
    const { undoManuallyMatched } = this.props

    const manuallyMatchedSignatureUploadPages = _.filter(unmatchedSignatureUploadPages, { status: 'manually_matched' })
    const sortedManuallyMatchedSignatureUploadPages = _.orderBy(manuallyMatchedSignatureUploadPages, 'updated_at', 'desc')

    return (
      <div style={styles.content}>
        {sortedManuallyMatchedSignatureUploadPages.map(manuallyMatchedSignatureUploadPage => (
          <ManuallyMatchedPage
            key={manuallyMatchedSignatureUploadPage.id}
            manuallyMatchedSignatureUploadPage={manuallyMatchedSignatureUploadPage}
            signaturePages={signaturePages}
            signers={signers}
            treeElements={treeElements}
            unmatchedSignatureUploads={unmatchedSignatureUploads}
            undoManuallyMatched={undoManuallyMatched}
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

ManuallyMatchedContainer.propTypes = {
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.object.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUploads: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  undoManuallyMatched: PropTypes.func.isRequired
}

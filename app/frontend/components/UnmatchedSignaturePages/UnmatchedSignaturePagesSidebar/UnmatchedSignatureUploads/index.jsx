import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import UnmatchedSignatureUpload from './UnmatchedSignatureUpload/index.jsx'

class UnmatchedSignatureUploads extends React.PureComponent {

  render() {
    const { signatureEntities, signatureGroups, signers, signingCapacities, signaturePages, treeElements, unmatchedSignatureUploads, unmatchedSignatureUploadPages } = this.props
    const { manuallyMatch, removeUpload } = this.props

    const signersAwaitingSignature = _.filter(signers, signer => (
      _.some(signer.signing_capacities.map(signingCapacityId => signingCapacities[signingCapacityId]), signerSigningCapacity => (
        _.some(signerSigningCapacity.signature_pages.map(signaturePageId => signaturePages[signaturePageId]), signerSigningCapacitySignaturePage => (
          _.includes(['awaiting_signature', 'link_ready', 'download_ready', 'opened'], signerSigningCapacitySignaturePage.signature_status)
        ))
      ))
    ))

    const unmatchedSignatureUploadsWithUnmatchedPages = _.filter(unmatchedSignatureUploads, unmatchedSignatureUpload => (
      _.some(unmatchedSignatureUpload.unmatched_signature_upload_pages.map(unmatchedSignatureUploadPageId => unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]), unmatchedSignatureUploadPage => (
        unmatchedSignatureUploadPage.status === 'unmatched'
      ))
    ))
    const sortedUnmatchedSignatureUploadsWithUnmatchedPages = _.orderBy(unmatchedSignatureUploadsWithUnmatchedPages, 'created_at', 'desc')
    const content = _.isEmpty(unmatchedSignatureUploadsWithUnmatchedPages) ?
      <div style={styles.empty}>
        <h3>
          <FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.no_unmatched_pages' />
        </h3>
        <br />
        <p className="gray">
          <FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.all_signature_pages_matched_or_removed' />
        </p>
      </div>
    :
      <div>
        {_.map(sortedUnmatchedSignatureUploadsWithUnmatchedPages, unmatchedSignatureUpload =>
          <UnmatchedSignatureUpload
            key={unmatchedSignatureUpload.id}
            manuallyMatch={manuallyMatch}
            signers={signersAwaitingSignature}
            signatureEntities={signatureEntities}
            signingCapacities={signingCapacities}
            signatureGroups={signatureGroups}
            signaturePages={signaturePages}
            treeElements={treeElements}
            unmatchedSignatureUpload={unmatchedSignatureUpload}
            unmatchedSignatureUploadPages={unmatchedSignatureUploadPages}
            removeUpload={removeUpload}
          />
        )}
      </div>

    return (
      <div style={styles.content}>
        {content}
      </div>
    )
  }
}

const styles = {
  empty: {
    padding: '3.2rem 6.4rem',
    textAlign: 'center'
  },
  content: {
    flexGrow: '1',
    background: Colors.white,
    border: `0.1rem solid ${Colors.whiteout.gray}`,
    borderRadius: '0.4rem',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}

UnmatchedSignatureUploads.propTypes = {
  signatureGroups: PropTypes.object.isRequired,
  signingCapacities: PropTypes.object.isRequired,
  signatureEntities: PropTypes.object.isRequired,
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.object.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUploads: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  manuallyMatch: PropTypes.func.isRequired,
  removeUpload: PropTypes.func.isRequired
}

export default UnmatchedSignatureUploads

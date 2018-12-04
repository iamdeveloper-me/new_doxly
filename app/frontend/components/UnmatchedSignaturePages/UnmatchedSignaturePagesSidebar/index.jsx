import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Colors from 'helpers/Colors'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Sidebar from 'components/Whiteout/Sidebar/index.jsx'
import TabBar from 'components/TabBar/index.jsx'
import TabContentContainer from './TabContentContainer/index.jsx'
import UnmatchedSignatureUploads from './UnmatchedSignatureUploads/index.jsx'

class UnmatchedSignaturePagesSidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'manually_matched'
    }
    this.setSelectedTab = this.setSelectedTab.bind(this)
  }

  setSelectedTab(value) {
    this.setState({ selectedTab: value })
  }

  render() {
    const { loading, shown, signatureEntities, signatureGroups, signers, signingCapacities, signaturePages, treeElements, unmatchedSignatureUploads, unmatchedSignatureUploadPages } = this.props
    const { hide, manuallyMatch, removeUpload, undoManuallyMatched, undoRemovedUpload } = this.props

    const unmatchedSignatureUploadPagesCount = _.size(_.filter(unmatchedSignatureUploadPages, { status: 'unmatched' }))
    const content = loading ?
      <LoadingSpinner showLoadingBox={false} showLoadingText={false} />
    :
      <div style={styles.content}>
        <div style={styles.header}>
          <h3>
            {unmatchedSignatureUploadPagesCount > 0 ?
              <FormattedMessage
                id='unmatched_signature_pages.sidebar.title_number'
                values={{
                  count: unmatchedSignatureUploadPagesCount
                }}
              />
            :
              <FormattedMessage id='unmatched_signature_pages.sidebar.title' />
            }
          </h3>
          <br />
          <p><FormattedMessage id='unmatched_signature_pages.sidebar.description'/></p>
        </div>
        <div style={styles.uploads}>
          <UnmatchedSignatureUploads
            signers={signers}
            signingCapacities={signingCapacities}
            signatureEntities={signatureEntities}
            signatureGroups={signatureGroups}
            signaturePages={signaturePages}
            treeElements={treeElements}
            unmatchedSignatureUploads={unmatchedSignatureUploads}
            unmatchedSignatureUploadPages={unmatchedSignatureUploadPages}
            manuallyMatch={manuallyMatch}
            removeUpload={removeUpload}
          />
        </div>
        <div style={styles.tabs}>
          <TabBar
            border={true}
            selectedTab={this.state.selectedTab}
            setSelectedTab={this.setSelectedTab}
            size='small'
            tabs={[
              {
                key: 'manually_matched',
                text: <FormattedMessage id='unmatched_signature_pages.sidebar.tabs.manually_matched' />
              },
              {
                key: 'removed_uploads',
                text: <FormattedMessage id='unmatched_signature_pages.sidebar.tabs.removed_uploads' />,
              }
            ]}
          />
          <TabContentContainer
            selectedTab={this.state.selectedTab}
            signers={signers}
            signaturePages={signaturePages}
            treeElements={treeElements}
            unmatchedSignatureUploads={unmatchedSignatureUploads}
            unmatchedSignatureUploadPages={unmatchedSignatureUploadPages}
            undoManuallyMatched={undoManuallyMatched}
            undoRemovedUpload={undoRemovedUpload}
          />
        </div>
      </div>

    return (
      <Sidebar
        shown={shown}
        hide={hide}
      >
        {content}
      </Sidebar>
    )
  }
}

const styles = {
  header: {
    flexShrink: '0'
  },
  content: {
    padding: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto'
  },
  uploads: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.6rem 0 2.4rem 0',
    overflow: 'auto'
  },
  tabs: {
    flexBasis: '35%',
    flexShrink: '0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  }
}

UnmatchedSignaturePagesSidebar.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool.isRequired,
  shown: PropTypes.bool.isRequired,
  signatureEntities: PropTypes.object.isRequired,
  signatureGroups: PropTypes.object.isRequired,
  signingCapacities: PropTypes.object.isRequired,
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.object.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUploads: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  hide: PropTypes.func.isRequired,
  manuallyMatch: PropTypes.func.isRequired,
  removeUpload: PropTypes.func.isRequired,
  undoManuallyMatched: PropTypes.func.isRequired,
  undoRemovedUpload: PropTypes.func.isRequired
}

export default injectIntl(UnmatchedSignaturePagesSidebar)

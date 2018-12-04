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
import Colors from 'helpers/Colors'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
} from 'components/Whiteout/Tooltipster/index.jsx'
import UnmatchedSignatureUploadPage from './UnmatchedSignatureUploadPage/index.jsx'

class UnmatchedSignatureUpload extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      expanded: true,
      showRemoveTooltip: false
    }
    this.toggle = this.toggle.bind(this)
    this.hideRemoveTooltip = this.hideRemoveTooltip.bind(this)
    this.showRemoveTooltip = this.showRemoveTooltip.bind(this)
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  hideRemoveTooltip() {
    this.setState({
      showRemoveTooltip: false
    })
  }

  showRemoveTooltip() {
    this.setState({
      showRemoveTooltip: true
    })
  }

  render() {
    const { intl, signatureEntities, signatureGroups, signers, signingCapacities, signaturePages, treeElements, unmatchedSignatureUpload, unmatchedSignatureUploadPages } = this.props
    const { manuallyMatch, removeUpload } = this.props

    const title = unmatchedSignatureUpload.is_client_upload ?
      <FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.client_upload' />
    :
      <FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.counsel_upload' />

    const unmatchedUnmatchedSignatureUploadPages = _.filter(unmatchedSignatureUpload.unmatched_signature_upload_pages, unmatchedSignatureUploadPageId => unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId].status === 'unmatched')

    const pages = (
      <div style={styles.pages}>
        <div><FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.where_should_this_signature_page_be_placed' /></div>
        {unmatchedUnmatchedSignatureUploadPages.map(unmatchedSignatureUploadPageId =>
          <UnmatchedSignatureUploadPage
            manuallyMatch={manuallyMatch}
            key={unmatchedSignatureUploadPageId}
            signers={signers}
            signingCapacities={signingCapacities}
            signatureEntities={signatureEntities}
            signatureGroups={signatureGroups}
            signaturePages={signaturePages}
            treeElements={treeElements}
            unmatchedSignatureUpload={unmatchedSignatureUpload}
            unmatchedSignatureUploadPage={unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId]}
          />
        )}
      </div>
    )

    return (
      <div style={styles.content}>
        <div style={styles.header} onClick={this.toggle}>
          <div style={styles.toggle}><i className={`mdi mdi-chevron-${this.state.expanded ? 'down' : 'right'}`}></i></div>
          <h4 style={styles.title}>{title}</h4>
          <div style={styles.date}>{moment(unmatchedSignatureUpload.created_at).format('M/D/YYYY, h:mm a')}</div>
        </div>
        <div style={styles.infoBox}>
          <div style={styles.info}>
            <div style={styles.fileName}>{unmatchedSignatureUpload.file_name}</div>
            <div className="gray" style={styles.userName}>
              <FormattedMessage
                id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.uploader'
                values={{
                  name: unmatchedSignatureUpload.uploader.name
                }}
              />
            </div>
          </div>
          <div style={styles.removeButton}>
            <Tooltipster
              open={this.state.showRemoveTooltip}
              triggerElement={
                <Button
                  style={styles.button}
                  type="removal"
                  size="mini"
                  icon="delete"
                  tooltip={intl.formatMessage({ id: 'unmatched_signature_pages.sidebar.unmatched_signature_uploads.remove_upload' })}
                  onClick={this.showRemoveTooltip}
                />
              }
              content={
                <div className="whiteout-ui do-not-hide-sidebar">
                  <TooltipsterBody>
                    <TooltipsterHeader>
                      <p><FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.remove_this_upload' /></p>
                    </TooltipsterHeader>
                    <TooltipsterText>
                      <p className="gray"><FormattedMessage id='unmatched_signature_pages.sidebar.unmatched_signature_uploads.move_this_upload_to_removed_uploads' /></p>
                    </TooltipsterText>
                    <TooltipsterButtons>
                      <Button size='small' type='secondary' text={intl.formatMessage({id: 'buttons.cancel'})} onClick={this.hideRemoveTooltip} />
                      <Button size='small' type='removal' text={intl.formatMessage({id: 'buttons.remove'})} onClick={() => removeUpload(unmatchedSignatureUpload.id)}/>
                    </TooltipsterButtons>
                  </TooltipsterBody>
                </div>
              }
              interactive={true}
              repositionsOnScroll={true}
              side='bottom'
              theme='tooltipster-doxly-whiteout'
              onClickOutside={this.hideRemoveTooltip}
            />
          </div>
        </div>
        {this.state.expanded ? pages : null}
      </div>
    )
  }
}

const styles = {
  content: {
    padding: '1.6rem',
    borderBottom: `0.1rem solid ${Colors.whiteout.gray}`
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  toggle: {
    flexShrink: '0',
    fontSize: '1.8rem'
  },
  title: {
    flexGrow: '1',
    padding: '0.4rem'
  },
  date: {
    color: Colors.whiteout.text.light,
    fontSize: '1.2rem',
    flexShrink: '0'
  },
  infoBox: {
    margin: '0.4rem 0',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  info: {
    fontSize: '1.2rem',
    lineHeight: '1.5',
    overflow: 'hidden',
    paddingRight: '0.8rem'
  },
  pages: {
    fontSize: '1.2rem',
    marginTop: '1.6rem'
  },
  fileName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  removeButton: {
    flexShrink: '0'
  },
  userName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}

UnmatchedSignatureUpload.propTypes = {
  intl: intlShape.isRequired,
  signatureEntities: PropTypes.object.isRequired,
  signatureGroups: PropTypes.object.isRequired,
  signingCapacities: PropTypes.object.isRequired,
  signaturePages: PropTypes.object.isRequired,
  signers: PropTypes.array.isRequired,
  treeElements: PropTypes.object.isRequired,
  unmatchedSignatureUpload: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  manuallyMatch: PropTypes.func.isRequired,
  removeUpload: PropTypes.func.isRequired
}

export default injectIntl(UnmatchedSignatureUpload)

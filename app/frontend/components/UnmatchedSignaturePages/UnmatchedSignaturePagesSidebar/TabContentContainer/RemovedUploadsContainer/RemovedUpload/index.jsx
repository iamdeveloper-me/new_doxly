import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import RemovedUploadPage from './RemovedUploadPage/index.jsx'

export default class RemovedUpload extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      expanded: true
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const { removedUpload, unmatchedSignatureUploadPages } = this.props
    const { undoRemovedUpload } = this.props
    const removedUnmatchedSignatureUploadPages = _.filter(removedUpload.unmatched_signature_upload_pages, unmatchedSignatureUploadPageId => unmatchedSignatureUploadPages[unmatchedSignatureUploadPageId].status === 'removed')
    const pages = (
      <div style={styles.pages}>
        {_.map(removedUnmatchedSignatureUploadPages, removedUploadPageId => (
          <RemovedUploadPage
            key={removedUploadPageId}
            removedUploadPage={unmatchedSignatureUploadPages[removedUploadPageId]}
          />
        ))}
      </div>
    )

    return(
      <div style={styles.content}>
        <div style={styles.header} onClick={this.toggle}>
          <div style={styles.toggle}><i className={`mdi mdi-chevron-${this.state.expanded ? 'down' : 'right'}`}></i></div>
          <h4 style={styles.title}>{<FormattedMessage id={`unmatched_signature_pages.sidebar.unmatched_signature_uploads.${removedUpload.is_client_upload ? 'client_upload' : 'counsel_upload'}`} />}</h4>
          <div style={styles.date}>{moment(removedUpload.created_at).format('M/D/YYYY, h:mm a')}</div>
        </div>
        <div style={styles.infoBox}>
          <div style={styles.info}>
            <div style={styles.fileName}>{removedUpload.file_name}</div>
            <div className="gray" style={styles.uploaderName}>{`${removedUpload.uploader.name}`}</div>
          </div>
          <div style={styles.undoButton}>
            <Button
              style={styles.button}
              type="secondary"
              size="mini"
              icon="undo-variant"
              onClick={() => undoRemovedUpload(removedUpload.id)}
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
    overflow: 'hidden'
  },
  pages: {
    fontSize: '1.2rem',
    marginTop: '1.6rem'
  },
  uploaderName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  fileName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  undoButton: {
    paddingLeft: '0.8rem'
  }
}

RemovedUpload.propTypes = {
  removedUpload: PropTypes.object.isRequired,
  unmatchedSignatureUploadPages: PropTypes.object.isRequired,

  undoRemovedUpload: PropTypes.func.isRequired
}

import _ from 'lodash'
import Dropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Assets from 'helpers/Assets'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import Schema from 'helpers/Schema'

export default class UploadStatus extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      uploading: false
    }
    this.onDrop = this.onDrop.bind(this)
    this.openFilePicker = this.openFilePicker.bind(this)
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.treeElement.attachment && this.props.treeElement.attachment) ||
        (prevProps.treeElement.attachment &&
          this.props.treeElement.attachment &&
          this.props.treeElement.attachment.latest_version &&
          prevProps.treeElement.attachment.latest_version &&
          prevProps.treeElement.attachment.latest_version.id !== this.props.treeElement.attachment.latest_version.id
      )) {
      this.setState({ uploading: false })
    }
  }

  onDrop(files) {
    if (files.length){
      this.setState({ uploading: true }, this.props.uploadVersion(this.props.treeElement, { file: files[0] }))
    }
  }

  openFilePicker() {
    this.dropzone.open()
  }

  render() {
    const uploadBadge = <div style={styles.container} className="no-bootstrap-file-input" onClick={this.openFilePicker}>
                          <img src={Assets.getPath('upload.svg')} />
                          <div style={styles.statusText}>
                            <FormattedMessage id='category.checklist.header.upload_file' />
                          </div>
                        </div>

    return (
      <div>
        <Dropzone
          onDrop={this.onDrop}
          ref={dropzone => { this.dropzone = dropzone }}
          disableClick={true}
          style={_.assign({}, styles.dropzone, this.state.uploading ? styles.blur : {})}
        >
        {this.state.uploading ?
          <div style={styles.uploading}>
            <LoadingSpinner
              loadingText={<span><FormattedMessage id='category.checklist.uploading' /></span>}
              showLoadingBox={false}
            />
          </div>
        :
          uploadBadge
        }
        </Dropzone>
      </div>
    )
  }

}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  statusText: {
    color: Colors.blue.normal,
    fontSize: '12px',
    paddingLeft: '8px'
  },
  uploading: {
    background: 'rgba(255,255,255,0.25)'
  }
}

UploadStatus.propTypes = {
  // attributes
  treeElement: Schema.treeElement.isRequired,

  // functions
  uploadVersion: PropTypes.func.isRequired


}

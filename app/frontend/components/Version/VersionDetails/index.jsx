import { FormattedMessage } from 'react-intl'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class VersionDetails extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    const { version, containerStyles, versionDate } = this.props
    const { clickFileName } = this.props
    const filename = version.file_name || `Untitled${version.file_type}`
    const user = version.uploader.user
    const entity = version.uploader.entity

    let uploadedBy
    if (entity.type === "Organization") {
      uploadedBy = <div>{`${user.first_name} ${user.last_name}`}&nbsp;<span style={styles.subtext}><FormattedMessage id='common_words.at' /></span> {entity.name}&nbsp;</div>
    } else {
      uploadedBy = <div>{`${user.first_name} ${user.last_name}`}</div>
    }
    return (
      <div style={_.assign({}, styles.info, containerStyles)}>
        <a style={styles.filename} onClick={clickFileName}>{filename}</a>
        <div style={styles.uploader}>
          {uploadedBy} {versionDate}
        </div>

      </div>
    )
  }

}

const styles = {
  filename: {
    color: Colors.text.darkBlue,
    paddingBottom: '4px',
    fontSize: '14px',
    lineHeight: '1.8'
  },
  info: {
    marginTop: '12px',
    flexShrink: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    lineHeight: '1.5'
  },
  uploader: {
    display: 'flex',
    flexWrap: 'wrap',
    color: Colors.text.gray
  },
  subtext: {
    color: Colors.gray.normal
  }
}


VersionDetails.propTypes = {
  containerStyles: PropTypes.object,
  version: PropTypes.object.isRequired,
  versionDate: PropTypes.object,

  clickFileName: PropTypes.func
}

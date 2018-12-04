import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import VersionDate from 'components/Version/VersionDate/index.jsx'
import VersionDetails from 'components/Version/VersionDetails/index.jsx'
import VersionIcon from 'components/Version/VersionIcon/index.jsx'

export default class DocumentViewerHeaderVersion extends React.PureComponent {

  render() {
    const { version } = this.props

    const versionDate =  <VersionDate version={version} containerStyles={styles.versionDate} />
    const versionDateHtml = <div style={styles.date}>
                        <span style={styles.subtext}><FormattedMessage id='common_words.on' /></span>
                        {versionDate}
                      </div>
    const versionDetails = <VersionDetails version={version} versionDate={versionDateHtml} containerStyles={styles.versionDetails} />
    
    return (
      <div style={styles.content}>
        <div style={styles.version}>
          <VersionIcon
            type={version.file_type}
          />
        </div>
        {versionDetails}
      </div>
    )
  }

}

const styles = {
  content: {
    display: 'flex',
    fontWeight: 500,
    color: Colors.gray.darker,
    fontSize: '12px',
    overflow: 'hidden',
    alignItems: 'center'
  },
  date: {
    display: 'flex',
    alignItems: 'flex-end',
    lineHeight: '1.5',
    alignSelf: 'flex-end',
    marginLeft: '2px'
  },
  subtext: {
    color: Colors.gray.normal
  },
  version: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: '4px'
  },
  versionDetails: {
    marginTop: '0',
    marginLeft: '4px'
  },
  versionDate: {
    width: '120px',
    marginLeft: '2px'
  }
}

DocumentViewerHeaderVersion.propTypes = {
  version: PropTypes.object.isRequired
}

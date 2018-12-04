import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import VersionDate from 'components/Version/VersionDate/index.jsx'
import VersionDetails from 'components/Version/VersionDetails/index.jsx'
import VersionPlacement from 'components/Version/VersionPlacement/index.jsx'

export default class UnplacedUploadVersion extends React.PureComponent {
  render() {
    const { placed, version } = this.props

    const versionPlacement = <VersionPlacement version={version} placed={placed} />
    const versionDetails = <VersionDetails version={version} />
    const versionDate = <VersionDate version={version} />

    return (
      <div style={styles.content}>
        <div style={styles.badgeAndDate}>
          {versionDate}
        </div>
        {versionDetails}
        {versionPlacement}
      </div>
    )
  }
}

const styles = {
  badgeAndDate: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontWeight: 500,
    color: Colors.gray.darker,
    fontSize: '12px',
    overflow: 'hidden',
    width: '100%'
  }
}

UnplacedUploadVersion.defaultProps = {
  documentViewerAlreadyShown: false
}

UnplacedUploadVersion.propTypes = {
  placed: PropTypes.bool,
  version: PropTypes.object.isRequired,
}

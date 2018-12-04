import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class VersionPlacement extends React.PureComponent {

  render() {

    const { placed, version} = this.props
    const html =  placed ?
      <div style={styles.container}>
        <span style={styles.subtext}><FormattedMessage id='category.sidebar.uploads.placed_in' /></span> <span style={styles.link}>{version.attachment.attachable.name}</span>
      </div>
    :
      <div style={styles.needsPlacement}><FormattedMessage id='category.sidebar.uploads.needs_placement' /></div>

    return html
  }

}

const styles = {
  container: {
    width: '100%'
  },
  link: {
    color: Colors.blue.dark
  },
  subtext: {
    color: Colors.gray.normal
  },
  needsPlacement: {
    fontWeight: 500,
    color: Colors.pink.normal
  }
}


VersionPlacement.propTypes = {
  placed: PropTypes.bool,
  version: PropTypes.object.isRequired
}

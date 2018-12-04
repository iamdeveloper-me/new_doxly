import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import moment from 'moment'

export default class VersionDate extends React.PureComponent {

  render() {
    const { containerStyles, version} = this.props
    return (
      <div style={_.assign({}, styles.date, containerStyles)}>
        {moment(version.created_at).format('MM/DD/YYYY, h:mma')}
      </div>
    )
  }
}

const styles = {
  date: {
    color: Colors.text.gray,
    fontSize: '12px'
  }
}


VersionDate.propTypes = {
  version: PropTypes.object.isRequired
}

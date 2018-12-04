import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class ClosingChecklistItemCheckmark extends React.PureComponent {

  render() {
    const { checked, enabled } = this.props
    const { markAsFinalOrComplete } = this.props

    return (
      <div
        className="whiteout-ui"
        style={styles.container(checked)}
        onClick={markAsFinalOrComplete}
      >
        <i className="mdi mdi-check" style={styles.icon}></i>
      </div>
    )
  }

}

const styles = {
  container: checked => ({
    marginTop: '0.2rem',
    height: '3.2rem',
    width: '3.2rem',
    borderRadius: '50%',
    background: checked ? Colors.whiteout.alert.complete : Colors.whiteout.gray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  icon: {
    fontSize: '2.4rem',
    color: Colors.whiteout.white
  }
}

ClosingChecklistItemCheckmark.propTypes = {
  checked: PropTypes.bool.isRequired,

  markAsFinalOrComplete: PropTypes.func.isRequired
}
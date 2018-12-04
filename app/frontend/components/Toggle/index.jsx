import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class Toggle extends React.PureComponent {

  constructor(props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle(e) {
    e.stopPropagation()
    this.props.toggle()
  }

  render() {
    return (
      <div onClick={this.handleToggle}>
        <img src={Assets.getPath('collapsed-large.svg')} style={styles.toggleArrow(this.props.expanded)}/>
      </div>
    )
  }

}

const styles = {
  toggleArrow: expanded => ({
    transform: expanded ? 'rotate(90deg)' : '',
    transitionDuration: '0.1s',
    transitionProperty: 'transform',
    cursor: 'pointer'
  })
}

Toggle.propTypes = {
  expanded: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

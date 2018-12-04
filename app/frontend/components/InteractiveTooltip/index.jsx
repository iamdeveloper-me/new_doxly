import PropTypes from 'prop-types'
import React from 'react'
import { Tooltip } from 'react-tippy'

import 'babel-polyfill'
import 'react-tippy/dist/tippy.css'

export default class InteractiveTooltip extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showPopover: false
    }
    this.onClickOutside = this.onClickOutside.bind(this)
    this.showPopover = this.showPopover.bind(this)
    this.hidePopover = this.hidePopover.bind(this)
    this.toggleClick = this.toggleClick.bind(this)
  }

  showPopover() {
    this.setState({ showPopover: true })
  }

  hidePopover() {
    this.setState({ showPopover: false })
  }

  toggleClick() {
    this.showPopover()
  }

  onClickOutside() {
    this.hidePopover()
  }

  render() {
    const { toggle, position, content } = this.props
    const { showPopover } = this.state

    return (
      <Tooltip
        position={position}
        trigger='click'
        interactive={true}
        arrow='true'
        theme='light'
        open={showPopover}
        onRequestClose={this.onClickOutside}
        html={
          <div id={`tooltip-${Math.random()}`}>
            {content}
          </div>
        }
      >
        <div onClick={this.toggleClick}>{toggle}</div>
      </Tooltip>
    )
  }

}

InteractiveTooltip.propTypes = {
  // for popover
  position: PropTypes.string,

  // for content
  content: PropTypes.element,
  toggle: PropTypes.element.isRequired
}

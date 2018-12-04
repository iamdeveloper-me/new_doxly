import PropTypes from 'prop-types'
import React from 'react'
import { Tooltip as TippyTooltip } from 'react-tippy'

import 'react-tippy/dist/tippy.css'
import TooltipBody from './TooltipBody/index.jsx'
import TooltipButtons from './TooltipButtons/index.jsx'
import TooltipHeader from './TooltipHeader/index.jsx'
import TooltipText from './TooltipText/index.jsx'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)
    this.onClickOutside = this.onClickOutside.bind(this)
  }

  onClickOutside() {
    this.props.hideTooltip()
  }

  render() {
    const { content, position, showTooltip, trigger } = this.props

    return (
      <TippyTooltip
        position={position}
        interactive={true}
        arrow='true'
        theme='light'
        open={showTooltip}
        onRequestClose={this.onClickOutside}
        html={content}
        followCursor={true}
      >
        {trigger}
      </TippyTooltip>
    )
  }
}

Tooltip.defaulProps = {
  position: 'bottom'
}

Tooltip.propTypes = {
  content: PropTypes.element.isRequired,
  position: PropTypes.string,
  showTooltip: PropTypes.bool.isRequired,
  trigger: PropTypes.element.isRequired,

  hideTooltip: PropTypes.func.isRequired
}

export { Tooltip, TooltipBody, TooltipButtons, TooltipHeader, TooltipText }

import _ from 'lodash'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'

import TooltipsterBody from './TooltipsterBody/index.jsx'
import TooltipsterButtons from './TooltipsterButtons/index.jsx'
import TooltipsterDropdownItem from './TooltipsterDropdownItem/index.jsx'
import TooltipsterHeader from './TooltipsterHeader/index.jsx'
import TooltipsterText from './TooltipsterText/index.jsx'

class TooltipsterClass extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      id: _.uniqueId('tooltip_')
    }
    this.getJqueryObject = this.getJqueryObject.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    try {
      const tooltipsterProps = _.omit(this.props, ['content', 'open', 'triggerElement'])
      this.getJqueryObject().tooltipster(tooltipsterProps)
    } catch(e) {

    }
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      if (this.props.trigger === null && prevProps.open !== this.props.open) {
        if (this.props.open) {
          this.getJqueryObject().tooltipster('open')
        } else {
          this.getJqueryObject().tooltipster('close')
        }
      }
    } catch(e) {
      
    }
  }

  handleClickOutside(e) {
    if (this.props.trigger === null && this.props.onClickOutside) {
      if ($(e.target).closest(`#${this.state.id}`).length === 0) {
        this.props.onClickOutside()
      }
    }
  }

  getJqueryObject() {
    return $(`.${this.state.id}`)
  }

  render() {
    const { content, triggerElement } = this.props
    return (
      <div>
        <div className={this.state.id} data-tooltip-content={`#${this.state.id}`}>
          {triggerElement}
        </div>
        <div className="tooltip_templates">
          <div id={this.state.id}>
            {content}
          </div>
        </div>
      </div>
    )
  }

}

TooltipsterClass.defaultProps = {
  open: false,
  trigger: null,

  onClickOutside: null
}

TooltipsterClass.propTypes = {
  open: PropTypes.bool,
  trigger: PropTypes.string,
  triggerElement: PropTypes.element.isRequired,

  onClickOutside: PropTypes.func
}

let Tooltipster = onClickOutside(TooltipsterClass)
export { Tooltipster, TooltipsterBody, TooltipsterButtons, TooltipsterDropdownItem, TooltipsterHeader, TooltipsterText }
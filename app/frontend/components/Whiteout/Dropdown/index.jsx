import _ from 'lodash'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'

import DropdownColumn from './DropdownColumn/index.jsx'
import DropdownFooter from './DropdownFooter/index.jsx'
import DropdownHeader from './DropdownHeader/index.jsx'
import DropdownItem from './DropdownItem/index.jsx'
import DropdownRow from './DropdownRow/index.jsx'
import DropdownSectionHeader from './DropdownSectionHeader/index.jsx'
import DropdownTrigger from './DropdownTrigger/index.jsx'

class Dropdown extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.onClick = this.onClick.bind(this)
    this.onMenuClick = this.onMenuClick.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  onClick() {
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open })
    }
  }

  onMenuClick() {
    if (!this.props.interactive) {
      this.setState({ open: !this.state.open })
    }
  }

  handleClickOutside() {
    if (this.state.open) {
      this.setState({ open: false })
    }
  }

  render() {
    const { caret, content, disabled, expanded, right, size, trigger } = this.props
    const uniqueId = _.uniqueId()

    let classNames = [
      'whiteout-dropdown dropdown-menu card',
      disabled ? 'disabled' : null,
      expanded ? 'expanded' : null,
      caret ? 'dropdown-caret' : null,
      right ? 'dropdown-menu-right' : null
    ].join(' ')

    return (
      <div>
        <div className={`dropdown ${size || ''}`}>
          <div id={uniqueId} onClick={this.onClick}>
            {trigger}
          </div>
          <div
            className={classNames}
            style={styles.menu(this.state.open)}
            onClick={this.onMenuClick}
            aria-labelledby={uniqueId}
          >
            {content}
          </div>
        </div>
      </div>
    )
  }

}

const styles = {
  menu: open => ({
    display: open ? 'block' : 'none'
  })
}

Dropdown.defaultProps = {
  caret: false,
  disabled: false,
  expanded: false,
  interactive: false,
  right: false
}

Dropdown.propTypes = {
  content: PropTypes.element.isRequired,
  caret: PropTypes.bool,
  disabled: PropTypes.bool,
  expanded: PropTypes.bool,
  interactive: PropTypes.bool,
  right: PropTypes.bool,
  size: PropTypes.string,
  trigger: PropTypes.element.isRequired
}

Dropdown = onClickOutside(Dropdown)
export { Dropdown, DropdownColumn, DropdownFooter, DropdownHeader, DropdownItem, DropdownRow, DropdownSectionHeader, DropdownTrigger }

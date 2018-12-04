import PropTypes from 'prop-types'
import React from 'react'

import {
  Tooltipster,
  TooltipsterDropdownItem
} from 'components/Whiteout/Tooltipster/index.jsx'

export default class ClosingChecklistItemType extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      dropdownShown: false
    }
    this.showDropdown = this.showDropdown.bind(this)
    this.hideDropdown = this.hideDropdown.bind(this)
    this.changeTreeElementType = this.changeTreeElementType.bind(this)
  }

  showDropdown() {
    this.setState({ dropdownShown: true })
  }

  hideDropdown() {
    this.setState({ dropdownShown: false })
  }

  changeTreeElementType(type) {
    this.setState({ dropdownShown: false })
    this.props.changeTreeElementType(type)
  }

  render() {
    const { type } = this.props
    const { changeTreeElementType } = this.props
    const icon = type === 'Task' ? 'calendar-check' : 'file'

    const trigger = (
      <div style={styles.trigger} onClick={this.showDropdown}>
        <i className={`mdi mdi-${icon} mdi-18px gray`}></i>
        <i style={styles.triggerArrow} className={`mdi mdi-menu-down gray`}></i>
      </div>
    )

    return (
      <div className="whiteout-ui" style={styles.container} onClick={(e) => e.stopPropagation()}>
        <Tooltipster
          open={this.state.dropdownShown}
          triggerElement={trigger}
          interactive={true}
          position='bottom'
          arrow={false}
          onClickOutside={this.hideDropdown}
          theme='tooltipster-doxly-whiteout'
          content={
            <div style={styles.dropdown}>
              <TooltipsterDropdownItem style={styles.dropdownItem} onClick={() => this.changeTreeElementType('Document')}>
                <i style={styles.optionIcon} className="mdi mdi-file mdi-18px"></i> Document
              </TooltipsterDropdownItem>
              <TooltipsterDropdownItem style={styles.dropdownItem} onClick={() => this.changeTreeElementType('Task')}>
                <i style={styles.optionIcon} className="mdi mdi-calendar-check mdi-18px"></i> Task
              </TooltipsterDropdownItem>
            </div>
          }
        />
      </div>
    )
  }

}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px'
  },
  dropdownItem: {
    width: '20.0rem'
  },
  optionIcon: {
    marginRight: '0.8rem'
  },
  trigger: {
    display: 'flex',
    alignItems: 'center'
  },
  triggerArrow: {
    marginTop: '0.2rem',
    fontSize: '1.4rem'
  }
}

ClosingChecklistItemType.propTypes = {
  type: PropTypes.string.isRequired,

  changeTreeElementType: PropTypes.func.isRequired
}

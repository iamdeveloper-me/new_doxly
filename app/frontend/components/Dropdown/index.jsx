import _ from 'lodash'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'

import AlertTooltip from 'components/AlertTooltip/index.jsx'
import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'

class Dropdown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showDropdown: this.props.showDropdown,
      showTooltip: false,
      deleteHover: false,
      hover: false
    }
    this.onClick = this.onClick.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onDeleteHover = this.onDeleteHover.bind(this)
    this.onClose = this.onClose.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }

  onClick() {
    if (this.props.getItems) {
      this.props.getItems()
    }
    this.setState({ showDropdown: !this.state.dropdownOpen })
  }

  handleClickOutside() {
    this.setState({ showDropdown: false })
  }

  onRemove() {
    this.setState({
      showDropdown: false,
      showTooltip: false
    })
    this.props.removeItem()
  }

  onHover() {
    this.setState({ hover: !this.state.hover })
  }

  onDeleteHover() {
    this.setState({ deleteHover: !this.state.deleteHover })
  }

  onClose() {
    this.setState({
      showDropdown: false,
      showTooltip: false
    })
  }

  showTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip })
  }

  render() {
    const { buttonStyle, confirmDelete, emptyText, header, isActive, label, menuItems, removeButton, rightAligned, tooltipHeader } = this.props
    const { hover, deleteHover, showDropdown, showTooltip } = this.state

    const hoverState = (showTooltip || hover) && isActive
    const dropdown = <div style={styles.dropdown(rightAligned)} onClick={this.onClose}>
                       <div style={styles.header(header)}>{header}</div>
                       <div style={styles.listContainer}>{menuItems}</div>
                     </div>

    return (
      <div style={styles.container}>
        <div
          style={_.assign({}, styles.button(showDropdown && isActive), buttonStyle)}
          onMouseEnter={this.onHover}
          onMouseLeave ={this.onHover}
        >
          <div style={styles.label(hoverState, showDropdown)}>
            <div style={styles.text} onClick={this.onClick}>
              {label || emptyText}
            </div>
            <AlertTooltip
              showTooltip={this.state.showTooltip}
              setShowTooltip={this.showTooltip}
              header={tooltipHeader}
              onDelete={this.onRemove}
              removeButton={removeButton}
              icon={
                <img
                  style={styles.icon(isActive && showDropdown)}
                  src={Assets.getPath(deleteHover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg')}
                  onClick={confirmDelete ? this.showTooltip : this.onRemove}
                  onMouseEnter={this.onDeleteHover}
                  onMouseLeave={this.onDeleteHover}
                />
              }
            />
          </div>
          {(showDropdown && isActive) ? dropdown : null}
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    position: 'relative'
  },
  button: isOpen => ({
    color: Colors.gray.normal,
    fontSize: '12px',
    border: isOpen ? `1px solid ${Colors.button.blue}` : 'none',
    background: isOpen ? Colors.white : 'none',
    borderRadius: '5px',
    padding: '2px 4px',
    textAlign: 'left',
    width: '100%'
  }),
  label: (hover, isOpen) => ({
    display: 'flex',
    textDecoration: hover && !isOpen ? `underline dashed ${Colors.button.blue}` : 'none'
  }),
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  icon: isOpen => ({
    display: isOpen ? 'flex' : 'none',
    width: '20px',
    minWidth: '20px',
    height: '18px',
    paddingLeft: '4px'
  }),
  dropdown: rightAligned => ({
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.button.blue}`,
    borderRadius: '5px',
    marginTop: '4px',
    position: 'absolute',
    left: rightAligned ? 'auto' : '0',
    right: rightAligned ? '0' : 'auto',
    zIndex: '1',
    whiteSpace: 'nowrap',
    minWidth: '170px',
    width: '100%'
  }),
  header: hasHeader => ({
    display: hasHeader ? 'flex' : 'none',
    fontSize: '10px',
    color: Colors.gray.normal,
    padding: '4px',
    borderBottom: `1px solid ${Colors.gray.light}`,
    boxShadow: `0px 1px 10px 0px ${Colors.gray.lighter}`,
    position: 'relative',
    fontStyle: 'normal'
  }),
  listContainer: {
    maxHeight: '75px',
    overflow: 'auto'
  }
}

Dropdown.defaultProps = {
  confirmDelete: true,
  isActive: true,
  isOpen: false,
  removeButton: false,
  rightAligned: false,
  showAlertTooltip: true,
  showDropdown: false
}

Dropdown.propTypes = {
  buttonStyle: PropTypes.object,
  confirmDelete: PropTypes.bool,
  emptyText: PropTypes.element.isRequired,
  header: PropTypes.element.isRequired,
  isActive: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  removeButton: PropTypes.bool,
  rightAligned: PropTypes.bool,
  showDropdown: PropTypes.bool,
  menuItems: PropTypes.array.isRequired,

  getItems: PropTypes.func,
  removeItem: PropTypes.func.isRequired
}

export default onClickOutside(Dropdown)

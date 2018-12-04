import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Assets from 'helpers/Assets'

class Filter extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.onClick = this.onClick.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  onClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  handleClickOutside() {
    this.setState({ isOpen: false })
  }

  render() {
    const { header, label, menuItems } = this.props

    return (
      <div style={styles.container}>
        <button
          style={styles.button}
          onClick={this.onClick}
        >
          <div style={styles.label}>
            <div>{label}</div>
          </div>
          <img src={Assets.getPath('icon-navigate-down.svg')} style={styles.carret} />
        </button>
        {this.state.isOpen ?
          <div style={styles.dropdown}>
            <div style={styles.header}>{header}</div>
            <div style={styles.listContainer}>
              {menuItems}
            </div>
          </div> : null}
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'relative',
    minWidth: '210px'
  },
  button: {
    color: Colors.blue.darker,
    fontSize: '14px',
    fontWeight: '500',
    border: `1px solid ${Colors.blueGray.lightest}`,
    background: 'white',
    borderRadius: '2px',
    padding: '2px 8px',
    width: '100%',
    textAlign: 'left',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '210px'
  },
  carret: {
    height: "7px",
    position: "absolute",
    right: "12px",
    top: "12px"
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    height: '18px'
  },
  dropdown: {
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.gray.lightest}`,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.25)',
    borderRadius: '4px',
    marginTop: '2px',
    position: 'absolute',
    minWidth: '100%',
    left: '0',
    zIndex: 1000,
    overflow: 'hidden'
  },
  header: {
    color: Colors.gray.normal,
    padding: '14px 24px 14px 24px',
    boxShadow: '0 0 14px 2px rgba(0, 0, 0, 0.2)'
  },
  listContainer: {
    overflow: 'auto',
    padding: '14px 24px 28px 24px'
  }
}

Filter.propTypes = {
  label: PropTypes.element.isRequired,
  header: PropTypes.object.isRequired,
  menuItems: PropTypes.object.isRequired
}

export default onClickOutside(Filter)

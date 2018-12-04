import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import TypeOptions from './TypeOptions/index.jsx'

export default class TypeDropdown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: null,
      isOpen: false
    }
    this.onClick = this.onClick.bind(this)
    this.setIsOpen = this.setIsOpen.bind(this)
    this.setItemType = this.setItemType.bind(this)
  }

  componentDidMount() {
    this.setState({ type: this.props.treeElement.type })
  }

  componentDidUpdate(prevProps) {
    const { treeElement } = this.props
    if (prevProps.treeElement !== treeElement) {
      this.setState({ type: treeElement.type })
    }
  }

  onClick() {
    this.setState({ isOpen: true })
  }

  setIsOpen(value) {
    this.setState({ isOpen: value})
  }

  setItemType(value) {
    this.setState({ type: value })
  }

  render() {
    const { treeElement } = this.props
    const { updateTreeElement } = this.props

    return (
      <div>
        <button
          style={styles.dropdown}
          onClick={this.onClick}
        >
          <div style={styles.type}>
            {this.state.type}
            <span style={styles.icon} className='glyphicon glyphicon-menu-down' aria-hidden='true'></span>
          </div>
        </button>
        {this.state.isOpen ?
          <TypeOptions
            options={[ 'Document', 'Task' ]}
            setIsOpen={this.setIsOpen}
            setItemType={this.setItemType}
            treeElement={treeElement}
            updateTreeElement={updateTreeElement}
          />
        :
          null
        }
      </div>
    )
  }

}

const styles = {
  dropdown: {
    position: 'relative'
  },
  type: {
    padding: '2px',
    fontSize: '12px',
    border: `1px solid ${Colors.black}`,
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    minWidth: '90px',
    width: '0px'
  },
  icon: {
    marginLeft: '4px',
    fontSize: '10px'
  }
}

TypeDropdown.propTypes = {
  // attributes
  treeElement: PropTypes.object.isRequired,

  // functions
  updateTreeElement: PropTypes.func.isRequired
}

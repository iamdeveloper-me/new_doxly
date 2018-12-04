import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class TypeOption extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  onClick() {
    const { option, treeElement } = this.props
    const { setIsOpen, setItemType, updateTreeElement } = this.props
    const updatedTreeElement = _.assign({}, treeElement, { type: option })

    updateTreeElement(updatedTreeElement)
    setItemType(option)
    setIsOpen(false)
  }

  render() {
    const { option } = this.props

    return (
      <div
        style={styles.option(this.state.hover)}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        onClick={this.onClick}
      >
        {option}
      </div>
    )
  }

}

const styles = {
  option: hover => ({
    padding: '2px 8px',
    backgroundColor: hover ? Colors.button.blue : Colors.white,
    color: hover ? Colors.white : Colors.gray.darkest,
    cursor: 'pointer'
  })
}

TypeOption.propTypes = {
  // attributes
  option: PropTypes.string.isRequired,
  treeElement: PropTypes.object.isRequired,

  // functions
  setIsOpen: PropTypes.func.isRequired,
  setItemType: PropTypes.func.isRequired,
  updateTreeElement: PropTypes.func.isRequired
}

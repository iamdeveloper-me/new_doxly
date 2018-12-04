import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import InlineEdit from 'components/InlineEdit/index.jsx'

export default class TreeElementText extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      isEditing: false
    }
    this.onClick = this.onClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  handleSubmit(value) {
    this.props.updateTreeElement(_.assign(_.cloneDeep(this.props.treeElement), { [this.props.attribute]: value }))
    this.setState({ isEditing: false })
  }

  onClick() {
    this.setState({ isEditing: true })
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  render() {
    const { attribute, placeholder, style, value } = this.props
    const { hover, isEditing } = this.state

    const treeElementText = isEditing ?
      <InlineEdit
        style={style}
        initialValue={value}
        label={attribute}
        placeholder={placeholder}
        handleSubmit={this.handleSubmit}
      />
    :
      <div
        style={_.assign({}, this.props.style, styles.text(hover))}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        {value || placeholder}
      </div>

    return (
      <div>{treeElementText}</div>
    )
  }

}

const styles = {
  text: hover => ({
    textDecoration: hover ? `underline dashed ${Colors.button.blue}` : 'none',
    wordWrap: 'break-word'
  })
}

TreeElementText.propTypes = {
  attribute: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  treeElement: PropTypes.object.isRequired,
  value: PropTypes.string,

  updateTreeElement: PropTypes.func.isRequired
}

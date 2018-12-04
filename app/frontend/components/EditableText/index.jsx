import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import InlineEdit from 'components/InlineEdit/index.jsx'

export default class EditableText extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      isEditing: this.props.defaultIsEditing,
      value: this.props.value
    }
    this.onClick = this.onClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  handleChange(value) {
    this.setState({
      value: value
    })
  }

  handleSubmit(value) {
    this.props.handleSubmit(value)
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
    const { label, placeholder, showLabel, style } = this.props
    const { verifyIsValid } = this.props
    const { hover, isEditing, value } = this.state

    const editableText = isEditing ?
      <InlineEdit
        style={style}
        initialValue={value}
        label={label}
        placeholder={placeholder}
        handleSubmit={this.handleSubmit}
        showLabel={showLabel}
        handleChange={this.handleChange}
        verifyIsValid={verifyIsValid}
      />
    :
      <div
        style={_.assign({}, style, styles.text(hover, isEditing))}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        {value || placeholder}
      </div>

    return editableText
  }

}

const styles = {
  text: (hover, isEditing) => ({
    textDecoration: hover ? `underline dashed ${Colors.button.blue}` : 'none',
    wordWrap: 'break-word',
    cursor: 'text',
    width: isEditing ? '100%' : 'auto'
  })
}

EditableText.defaultProps = {
  defaultIsEditing: false,
  label: '',
  showLabel: true,
  style: {},
  value: null,

  verifyIsValid: () => true
}

EditableText.propTypes = {
  defaultIsEditing: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  showLabel: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.string,

  handleSubmit: PropTypes.func.isRequired,
  verifyIsValid: PropTypes.func
}

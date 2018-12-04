import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Input from 'components/Whiteout/Input/index.jsx'

export default class EditableNumber extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      isEditing: false,
      value: this.props.value,
      isValid: true
    }
    this.onClick = this.onClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  handleChange(values) {
    this.setState({
      value: values.floatValue !== undefined ? values.floatValue : null,
      isValid: this.props.verifyIsValid(values)
    })
  }

  handleSubmit() {
    if (!this.state.isValid) {
      return
    }
    this.props.handleSubmit(this.state.value)
    this.setState({
      isEditing: false,
      hover: false
    })
  }

  onClick() {
    if (!this.props.disabled) {
      this.setState({ isEditing: true })
    }
  }

  onMouseEnterHandler() {
    if (!this.props.disabled) {
      this.setState({ hover: true })
    }
  }

  onMouseLeaveHandler() {
    if (!this.props.disabled) {
      this.setState({ hover: false })
    }
  }

  render() {
    const { disabled, numberFormatProps, placeholder, style } = this.props
    const { hover, isEditing, isValid, value } = this.state

    const editableNumber = isEditing && !disabled ?
      <NumberFormat
        value={this.state.value}
        displayType='input'
        onValueChange={this.handleChange}
        customInput={Input}
        height='mini'
        autoFocus={true}
        onBlur={this.handleSubmit}
        onEnter={this.handleSubmit}
        includeMargin={false}
        invalid={!isValid}
        {...numberFormatProps}
      />
    :
      <div
        style={_.assign({}, style, styles.text(hover, isEditing))}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <NumberFormat
          value={this.state.value !== null ? value : placeholder}
          displayType='text'
          {...numberFormatProps}
        />
      </div>

    return editableNumber
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

EditableNumber.defaultProps = {
  numberFormatProps: null,
  placeholder: '',
  style: {},
  value: null,

  verifyIsValid: () => true
}

EditableNumber.propTypes = {
  numberFormatProps: PropTypes.object,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,

  handleSubmit: PropTypes.func.isRequired,
  verifyIsValid: PropTypes.func
}

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

// TODO: This component and the Edit component should be the same, preferably moving toward the design used in this component
export default class InlineEdit extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hasChanged: false,
      value: this.props.initialValue,
      height: '32px',
      isValid: this.props.verifyIsValid(this.props.initialValue)
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    const textareaHeight = this.textarea.scrollHeight

    if (textareaHeight > 40) {
      this.setState({
        height: `${textareaHeight}px`
      })
    }
    this.textarea.focus()
  }

  handleChange(e) {
    const { value, scrollHeight } = e.target
    const trimmedValue = value.trim()

    this.setState({
      hasChanged: true,
      value: trimmedValue,
      height: `${scrollHeight}px`,
      isValid: this.props.verifyIsValid(trimmedValue)
    })

    if (this.props.handleChange) {
      this.props.handleChange(trimmedValue)
    }
  }

  handleBlur() {
    this.submit(false)
  }

  handleKeyPress(e) {
    if (e.key === 'Enter'){
      e.preventDefault()
      this.submit(true)
    }
  }

  submit(usingEnter = false) {
    if (this.state.isValid) {
      this.props.handleSubmit(this.state.value, usingEnter)
    }
  }

  render() {
    const { label, placeholder, showLabel, style } = this.props
    const inputStyle = _.assign({}, style, styles.input(showLabel), { height: this.state.height })
    const labelComponent = showLabel ? <div style={styles.header}>{label}</div> : null

    // TODO: pass formatted message into textarea placeholder
    return (
      <div style={styles.container(showLabel, this.state.isValid || !this.state.hasChanged)}>
        {labelComponent}
        <textarea
          ref={textarea => {this.textarea = textarea}}
          style={inputStyle}
          defaultValue={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
          tabIndex='0'
          placeholder={placeholder}
        />
      </div>
    )
  }

}

const styles = {
  container: (showLabel, isValid) => ({
    backgroundColor: Colors.white,
    border: isValid ? `1px solid ${Colors.button.blue}` : `2px solid ${Colors.whiteout.alert.error}`,
    borderRadius: '4px',
    position: 'relative',
    marginTop: showLabel ? '-4px' : '0',
    marginLeft: showLabel ? '-4px' : '0',
    width: '100%',
    fontFamily: '"Roboto", "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif'
  }),
  header: {
    textTransform: 'uppercase',
    padding: '2px 0 0 4px',
    fontSize: '10px',
    color: Colors.gray.dark,
    position: 'absolute'
  },
  input: showLabel => ({
    width: '100%',
    border: 'none',
    borderRadius: '4px',
    marginTop: '4px',
    marginBottom: showLabel ? '0' : '4px',
    paddingLeft: '4px',
    paddingTop: showLabel ? '12px' : '0',
    overflow: 'hidden',
    resize: 'none'
  })
}

InlineEdit.defaultProps = {
  showLabel: true,

  verifyIsValid: () => true
}

InlineEdit.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  initialValue: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  showLabel: PropTypes.bool,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,

  verifyIsValid: PropTypes.func
}

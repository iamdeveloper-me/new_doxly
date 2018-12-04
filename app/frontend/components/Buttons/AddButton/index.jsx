import PropTypes from 'prop-types'
import React from 'react'

import AlertTooltip from 'components/AlertTooltip/index.jsx'
import Colors from 'helpers/Colors'

export default class AddButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false
    }
    this.onClick = this.onClick.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }

  onClick() {
    const { disabled, hasTooltip } = this.props

    if (disabled && hasTooltip) {
      this.setState({ showTooltip: true }, () => {
        setTimeout(() => { this.showTooltip() }, 3000)
      })
    } else {
      this.props.addElement()
    }
  }

  showTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip })
  }

  render() {
    const { canDelete, disabled, text, tooltipText } = this.props

    return (
      <AlertTooltip
        position='left'
        interactive={false}
        text={tooltipText}
        canDelete={canDelete}
        showTooltip={this.state.showTooltip}
        setShowTooltip={this.showTooltip}
        icon={
          <button style={styles.button(disabled)} onClick={this.onClick}>
            {text}<span className='glyphicon glyphicon-plus-sign' aria-hidden='true' style={styles.addIcon}></span>
          </button>
        }
      />
    )
  }

}

const styles = {
  button: disabled => ({
    color: disabled ? Colors.gray.normal : Colors.button.blue,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center'
  }),
  addIcon: {
    paddingLeft: '8px',
    fontSize: '18px'
  }
}

AddButton.defaultProps = {
  canDelete: false,
  disabled: false,
  hasTooltip: false
}

AddButton.propTypes = {
  canDelete: PropTypes.bool,
  disabled: PropTypes.bool,
  hasTooltip: PropTypes.bool,
  text: PropTypes.element.isRequired,
  tooltipText: PropTypes.string,

  addElement: PropTypes.func
}

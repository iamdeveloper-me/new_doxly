import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

export default class IconCheckbox extends React.PureComponent {

  render() {
    const { checkedIcon, width, label, style, uncheckedIcon } = this.props
    const { updateAttribute } = this.props
    const icon = this.props.isChecked ? checkedIcon : uncheckedIcon

    return (
      <div style={_.assign({}, styles.checkbox, style)}>
        <img
          style={styles.icon(width)}
          src={icon}
          onClick={updateAttribute}
        />
        <div>{label}</div>
      </div>
    )
  }

}

const styles = {
  checkbox: {
    cursor: 'pointer',
    flexShrink: 0
  },
  icon: width => ({
    minWidth: width,
    maxWidth: width
  })
}

IconCheckbox.propTypes = {
  checkedIcon: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  label: PropTypes.element,
  style: PropTypes.object,
  uncheckedIcon: PropTypes.string.isRequired,

  updateAttribute: PropTypes.func
}

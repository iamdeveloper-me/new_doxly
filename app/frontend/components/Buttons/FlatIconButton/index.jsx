import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class FlatIconButton extends React.PureComponent {

  render() {
    const { icon, iconStyle, image, style, text } = this.props
    const { onClick } = this.props
    const iconImage = icon ?
      <span className={icon} aria-hidden="true" style={_.assign({}, styles.icon(text), iconStyle)}></span>
    :
      <img src={Assets.getPath(image)} />

    return (
      <button
        style={_.assign({}, styles.button, style)}
        onClick={onClick}
      >
        {iconImage}
        {text}
      </button>
    )
  }
}

const styles = {
  button: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center'
  },
  icon: hasText => ({
    paddingRight: hasText ? '4px' : '0',
    fontSize: '16px'
  })
}

FlatIconButton.defaultProps = {
  style: {}
}

FlatIconButton.propTypes = {
  icon: PropTypes.string,
  iconStyle: PropTypes.object,
  image: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.element,
  onClick: PropTypes.func
}

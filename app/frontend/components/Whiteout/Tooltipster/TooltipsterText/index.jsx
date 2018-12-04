import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const TooltipsterText = ({ children, style }) => {
  return (
    <div style={Object.assign({}, styles.text, style)}>
      {children}
    </div>
  )
}

const styles = {
  text: {
    color: Colors.gray.normal,
    fontSize: '1.4rem',
    paddingTop: '1.2rem'
  }
}

TooltipsterText.defaultProps = {
  style: {}
}

TooltipsterText.propTypes = {
  style: PropTypes.object
}

export default TooltipsterText

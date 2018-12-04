import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const TooltipText = ({ children, style }) => {
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

TooltipText.defaultProps = {
  style: {}
}

TooltipText.propTypes = {
  style: PropTypes.object
}

export default TooltipText

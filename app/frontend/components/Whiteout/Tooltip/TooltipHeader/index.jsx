import PropTypes from 'prop-types'
import React from 'react'

const TooltipHeader = ({ children, style }) => {
  return (
    <div style={Object.assign({}, styles.header, style)}>
      {children}
    </div>
  )
}

const styles = {
  header: {
    fontSize: '1.4rem'
  }
}

TooltipHeader.defaultProps = {
  style: {}
}

TooltipHeader.propTypes = {
  style: PropTypes.object
}

export default TooltipHeader

import PropTypes from 'prop-types'
import React from 'react'

const TooltipsterHeader = ({ children, style }) => {
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

TooltipsterHeader.defaultProps = {
  style: {}
}

TooltipsterHeader.propTypes = {
  style: PropTypes.object
}

export default TooltipsterHeader

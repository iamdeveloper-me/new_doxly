import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const TooltipsterBody = ({ children, style }) => {
  return (
    <div className='whiteout-ui' style={_.assign({}, styles.body, style)}>
      {children}
    </div>
  )
}

const styles = {
  body: {
    width: '20rem',
    padding: '1.2rem .8rem',
    textAlign: 'left'
  }
}

TooltipsterBody.defaultProps = {
  style: {}
}

TooltipsterBody.propTypes = {
  style: PropTypes.object
}

export default TooltipsterBody

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const TooltipBody = ({ children, style }) => {
  return (
    <div  className='whiteout-ui' style={_.assign({}, styles.body, style)}>
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

TooltipBody.defaultProps = {
  style: {}
}

TooltipBody.propTypes = {
  style: PropTypes.object
}

export default TooltipBody

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

const DropdownTrigger = ({ backgroundColor, style, text }) => {
  return (
    <div className="control-dropdown" style={_.assign({}, styles.trigger(backgroundColor), style)}>
      {text}
    </div>
  )
}

DropdownTrigger.propTypes = {
  backgroundColor: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired
}

const styles = {
  trigger: backgroundColor => ({
    backgroundColor: backgroundColor || Colors.white
  })
}

export default DropdownTrigger
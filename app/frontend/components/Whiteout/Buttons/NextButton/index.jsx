import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'

const NextButton = ({disabled, onClick}) => {
  return (
    <Button
      type='removal'
      disabled={disabled}
      rounded={true}
      icon='arrow-right'
      onClick={onClick}
    />
  )
}

NextButton.defaultProps = {
  disabled: false
}

NextButton.propTypes = {
  disabled: PropTypes.bool,

  onClick: PropTypes.func
}

export default NextButton
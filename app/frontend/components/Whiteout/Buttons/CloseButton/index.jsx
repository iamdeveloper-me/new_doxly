import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'

const CloseButton = ({disabled, onClick}) => {
  return (
    <Button
      disabled={disabled}
      rounded={true}
      icon='close'
      onClick={onClick}
    />
  )
}

CloseButton.defaultProps = {
  disabled: false
}

CloseButton.propTypes = {
  disabled: PropTypes.bool,

  onClick: PropTypes.func
}

export default CloseButton
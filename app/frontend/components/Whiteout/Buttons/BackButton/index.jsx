import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'

const BackButton = ({disabled, onClick}) => {
  return (
    <Button
      disabled={disabled}
      rounded={true}
      icon='arrow-left'
      onClick={onClick}
    />
  )
}

BackButton.defaultProps = {
  disabled: false
}

BackButton.propTypes = {
  disabled: PropTypes.bool,

  onClick: PropTypes.func
}

export default BackButton
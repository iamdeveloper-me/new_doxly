import PropTypes from 'prop-types'
import React from 'react'

const AlphabetNumber = ({ lowercase, number, suffix }) => {
  const alphabetize = number => (number >= 26 ? alphabetize((number / 26 >> 0) - 1) : '') + 'abcdefghijklmnopqrstuvwxyz'[number % 26 >> 0]
  const result = alphabetize(number)
  return <span>{lowercase ? result : result.toUpperCase()}{suffix}</span>
}

AlphabetNumber.defaultProps = {
  lowercase: false,
  suffix: ''
}

AlphabetNumber.propTypes = {
  lowercase: PropTypes.bool,
  number: PropTypes.number.isRequired,
  suffix: PropTypes.string
}

export default AlphabetNumber
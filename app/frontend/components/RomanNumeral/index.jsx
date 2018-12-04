import PropTypes from 'prop-types'
import React from 'react'

const RomanNumeral = ({ lowercase, number, suffix }) => {
  if (!+number) {
    return <span></span>
  }
  const digits = String(+number).split("")
  const key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
              "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC", // eslint-disable-line
              "","I","II","III","IV","V","VI","VII","VIII","IX"] // eslint-disable-line
  let roman = ""
  let i = 3
  while (i--) {
    roman = (key[+digits.pop() + (i * 10)] || "") + roman
  }
  const result = Array(+digits.join("") + 1).join("M") + roman
  return <span>{lowercase ? result.toLowerCase() : result}{suffix}</span>
}

RomanNumeral.defaultProps = {
  lowercase: false,
  suffix: ''
}

RomanNumeral.propTypes = {
  lowercase: PropTypes.bool,
  number: PropTypes.number.isRequired,
  suffix: PropTypes.string
}

export default RomanNumeral
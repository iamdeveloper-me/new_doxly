import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import AlphabetNumber from 'components/AlphabetNumber/index.jsx'
import RomanNumeral from 'components/RomanNumeral/index.jsx'

export default class ClosingChecklistNumber extends React.PureComponent {

  /* Convert index to number, letter, or roman numeral */
  getNumber(position, indentation) {
    switch(indentation) {
      case 1:
        return <AlphabetNumber number={position-1} suffix='.' lowercase={true} />
      case 2:
        return <RomanNumeral number={position} suffix='.' lowercase={true} />
      case 3:
        return <AlphabetNumber number={position-1} suffix='.' />
      case 4:
        return <RomanNumeral number={position} suffix='.' />
      default:
        return `${position}.`
    }
  }

  render() {
    const { indentation, numberingStyle, position } = this.props
    return (
      <div style={_.assign({}, styles.numbering, numberingStyle)}>
        {this.getNumber(position, indentation)}&nbsp;
      </div>
    )
  }
}

const styles = {
  numbering: {
    opacity: '.5',
    minWidth: '25px',
    flexShrink: 0
  }
}

ClosingChecklistNumber.propTypes = {
  indentation: PropTypes.number,
  numberingStyle: PropTypes.object,
  position: PropTypes.number
}

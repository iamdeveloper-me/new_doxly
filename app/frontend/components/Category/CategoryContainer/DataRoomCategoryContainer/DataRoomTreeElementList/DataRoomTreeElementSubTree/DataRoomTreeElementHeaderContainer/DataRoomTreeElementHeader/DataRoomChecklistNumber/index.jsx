import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

export default class DataRoomChecklistNumber extends React.PureComponent {

  getNumber(parentNumber, position) {
    if (parentNumber === ''){
      return position + '.'
    } else {
      return parentNumber + '.' + position
    }
  }

  render() {
    return (
      <div style={_.assign({}, styles.numbering, this.props.numberingStyle)}>{this.getNumber(this.props.parentNumber, this.props.position)}&nbsp;</div>
    )
  }
}

const styles = {
  numbering: {
    opacity: '.5',
    minWidth: 25,
    flexShrink: 0
  }
}

DataRoomChecklistNumber.defaultProps = {
  parentNumber: ''
}

DataRoomChecklistNumber.propTypes = {
  // attributes
  numberingStyle: PropTypes.object,
  parentNumber: PropTypes.string,
  position: PropTypes.number
}

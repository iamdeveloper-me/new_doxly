import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class Status extends React.PureComponent {

  render() {
    const { status } = this.props

    return (
      <div style={styles.container}>
        {status ?
          <div style={styles.status(status)}>
            {status}
          </div>
        :
          null
        }
      </div>
    )
  }

}

const styles = {
  container: {
    width: '100%',
    paddingRight: '8px'
  },
  status: status => ({
    width: '100%',
    padding: getPadding(status),
    borderRadius: '4px',
    border: `1px solid ${getStatusBorderColor(status)}`,
    color: getStatusTextColor(status),
    fontWeight: 'bold',
    fontSize: '12px',
    background: getStatusBackgroundColor(status),
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }),
  iconContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    height: '24px'
  },
  label: {
    color: Colors.button.blue,
    paddingLeft: '4px',
    fontSize: '14px'
  }
}

const getStatusTextColor = (status) => {
  // checks to see if the format is 'someNum/someNum' e.g 123/456
  const checkStatusFormat = /\d+\/\d+/.test(status.split(' ')[0])
  if (checkStatusFormat && status.split(' ')[0].split('/')[0] == status.split(' ')[0].split('/')[1] && status.split(' ')[0].split('/')[0] != 0) {
    return '#34a059'
  } else if (/\d+\/\d+/.test(status.split(' ')[0])) {
    return '#f29144'
  } else {
    switch(status) {
      case 'Draft':
        return Colors.pink.dark
      case 'Needs Review':
        return Colors.pink.dark
      case '0 Documents':
        return Colors.gray.dark
      default:
        return Colors.white
    }
  }
}

const getStatusBorderColor = (status) => {
  // checks to see if the format is 'someNum/someNum' e.g 123/456
  const checkStatusFormat = /\d+\/\d+/.test(status.split(' ')[0])
  if (checkStatusFormat && status.split(' ')[0].split('/')[0] == status.split(' ')[0].split('/')[1] && status.split(' ')[0].split('/')[0] != 0) {
    return '#E1F1E6'
  } else if (/\d+\/\d+/.test(status.split(' ')[0])) {
    return 'white'
  } else {
    switch(status) {
      case 'Draft':
        return Colors.pink.dark
      case 'Needs Review':
        return Colors.pink.dark
      case '0 Documents':
        return Colors.gray.lightest
      default:
        return 'rgba(0,0,0,.25)'
    }
  }
}

const getStatusBackgroundColor = (status) => {
  // checks to see if the format is 'someNum/someNum' e.g 123/456
  const checkStatusFormat = /\d+\/\d+/.test(status.split(' ')[0])
  if (checkStatusFormat && status.split(' ')[0].split('/')[0] == status.split(' ')[0].split('/')[1] && status.split(' ')[0].split('/')[0] != 0) {
    return '#E1F1E6'
  } else if (/\d+\/\d+/.test(status.split(' ')[0])) {
    return 'rgba(227, 106, 11, .15)'
  } else {
    switch(status) {
      case '0 Documents':
        return Colors.gray.lightest
      default:
        return Colors.blue.normal
    }
  }
}

const getPadding = (status) => {
  if (/\d+\/\d+/.test(status.split(' ')[0]) || status === '0 Documents') {
    return '4px'
  } else {
    return '8px'
  }
}

Status.propTypes = {
  status: PropTypes.string
}

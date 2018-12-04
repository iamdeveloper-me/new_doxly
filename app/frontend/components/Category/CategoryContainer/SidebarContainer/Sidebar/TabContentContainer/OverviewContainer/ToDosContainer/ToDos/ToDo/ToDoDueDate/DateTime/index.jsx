import DayPicker from "react-day-picker"
import { FormattedMessage } from 'react-intl'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import Time from './Time/index.jsx'
import "react-day-picker/lib/style.css"

class DateTime extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      selectedDay: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleChange(day) {
    this.setState({
      selectedDay: day
    })

    this.props.setDate(day)
  }

  handleClickOutside() {
    this.props.setHover(false)
  }

  // TODO: need better way to get times
  render() {
    const times = ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm' ]
    const timePicker = (
      times.map((time, index) => (
        <Time
          key={index}
          time={time}
          setTime={this.props.setTime}
        />
      ))
    )

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.date}>
            <FormattedMessage id='category.sidebar.to_dos.due_date' />
          </div>
          <div style={styles.time}>
            <FormattedMessage id='category.sidebar.to_dos.due_time' />
          </div>
        </div>
        <div style={styles.dateTime}>
          <DayPicker
            selectedDays={this.state.selectedDay}
            onDayClick={this.handleChange}
          />
          <div style={styles.timePicker}>
            {timePicker}
          </div>
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.button.blue}`,
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    right: '0',
    zIndex: 1
  },
  header: {
    width: '100%',
    display: 'flex',
    height: '20px',
    alignItems: 'center',
    color: Colors.gray.normal,
    borderBottom: `1px solid ${Colors.gray.light}`,
    boxShadow: `0px 1px 10px 0px ${Colors.gray.lighter}`
  },
  dateTime: {
    display: 'flex'
  },
  date: {
    flexGrow: '3',
    textAlign: 'left',
    paddingLeft: '12px'
  },
  time: {
    flexGrow: '1',
    textAlign: 'center',
    paddingRight: '8px'
  },
  timePicker: {
    height: '220px',
    paddingRight: '8px',
    overflowX: 'hidden',
    borderLeft: `1px solid ${Colors.gray.normal}`
  }
}

DateTime.propTypes = {
  date: PropTypes.object,
  time: PropTypes.string,
  toDo: PropTypes.object.isRequired,

  setDate: PropTypes.func.isRequired,
  setHover: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  updateToDo: PropTypes.func.isRequired
}

export default onClickOutside(DateTime)

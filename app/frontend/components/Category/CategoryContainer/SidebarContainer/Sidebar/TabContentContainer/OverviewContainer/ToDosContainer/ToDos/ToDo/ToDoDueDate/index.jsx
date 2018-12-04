import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import DateTime from './DateTime/index.jsx'

export default class ToDoDueDate extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showCalendar: false,
      date: null,
      time: null,
      selectedTime: null,
      dateHover: false,
      timeHover: false
    }
    this.getDueAt = this.getDueAt.bind(this)
    this.getDateFormat = this.getDateFormat.bind(this)
    this.deleteDate = this.deleteDate.bind(this)
    this.deleteTime = this.deleteTime.bind(this)
    this.timeHover = this.timeHover.bind(this)
    this.dateHover = this.dateHover.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onHover = this.onHover.bind(this)
    this.setDate = this.setDate.bind(this)
    this.setTime = this.setTime.bind(this)
    this.setHover = this.setHover.bind(this)
  }

  componentDidMount() {
    this.getDueAt()
  }

  getDueAt() {
    const { toDo } = this.props
    if (toDo.due_dates && toDo.due_dates.length > 0) {
      const dateTime = this.props.toDo.due_dates[0].value
      const date = moment(dateTime).hour(0).minute(0).second(0).millisecond(0)
      const timeZone = moment.tz.guess()
      // don't show time if 00:00
      const zeroTime = moment(dateTime).startOf('day').valueOf() === moment(dateTime).valueOf()
      const time = !zeroTime ? moment.tz(dateTime, timeZone).format('h:mm a') : '11:59 pm'
      if (dateTime) {
        this.setState({
          date: date,
          time: time
        })
      }
    }
  }

  updateDate() {
    const { date, time } = this.state

    let dueAt = null

    const timeZone = moment.tz.guess()
    if (date && time) {
      const formattedDate = moment(date).format("dddd, MMMM Do YYYY") + ' ' + time
      dueAt = moment.tz(formattedDate, "dddd, MMMM Do YYYY HH:mm a", timeZone).format()
    } else if (time) {
      dueAt = moment.tz(time, timeZone)
    } else if (date) {
      const dateFormat = moment(date).hour(0).minute(0).second(0).millisecond(0)
      dueAt = dateFormat.format()
    } else {
      dueAt
    }
    const updatedToDo = _.merge(this.props.toDo, { due_dates: [{ value: dueAt }] })
    this.props.updateToDo(updatedToDo)
  }

  onClick() {
    this.setState({ showCalendar: true })
  }

  onHover() {
    this.setState({ hover: !this.state.hover })
  }

  dateHover() {
    this.setState({
      dateHover: !this.state.dateHover
    })
  }

  timeHover() {
    this.setState({
      timeHover: !this.state.timeHover
    })
  }

  setDate(value) {
    this.setState({
      date: value,
      showCalendar: this.state.time === null // hide calendar if date and time both set
    }, this.updateDate)
  }

  setTime(value) {
    this.setState({
      time: value,
      showCalendar: this.state.date === null // hide calendar if date and time both set
    }, this.updateDate)
  }

  deleteTime(e) {
    this.setState({ time: null }, this.updateDate)
    e.stopPropagation()
  }

  deleteDate(e) {
    this.setState({ date: null }, this.updateDate)
    e.stopPropagation()
  }

  setHover(value) {
    this.setState({
      timeHover: value,
      dateHover: value,
      hover: value,
      showCalendar: value
    })
  }

  getDateFormat(date) {
    const currentDate = moment().hour(0).minute(0).second(0).millisecond(0)
    const dateTimeDays = currentDate.diff(date, 'days')
    const isThisWeek = (currentDate.isoWeek() == date.isoWeek())
    const isThisYear = date.format('YYYY') == currentDate.format('YYYY')

    if (dateTimeDays > 1) {
      if (isThisWeek) {
        return date.format('dddd')
      } else if (isThisYear) {
        return date.format('MMMM D')
      } else {
        return date.format('M/D/YYYY')
      }
    } else {
      return date.calendar().split(' ')[0]
    }
  }

  render() {
    const { date, time, hover, showCalendar, timeHover, dateHover, selectedTime } = this.state
    const { toDo } = this.props
    const { updateToDo } = this.props
    const isActive = (hover || showCalendar || timeHover || dateHover) && !toDo.is_complete
    const dataDeleteIcon = dateHover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'
    const timeDeleteIcon = timeHover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'
    const datePlaceholder = <FormattedMessage id='category.sidebar.to_dos.due_date' />
    const timePlaceholder = <FormattedMessage id='category.sidebar.to_dos.due_time' />

    return (
      <div>
        <div
          style={styles.button(date, toDo.is_complete, isActive)}
          onClick={this.onClick}
          onMouseOver={this.onHover}
          onMouseOut ={this.onHover}
        >
          <div style={styles.dateTime}>
            <div>{date ? this.getDateFormat(moment(date)) : datePlaceholder}</div>
            {date && isActive ?
              <img
                src={Assets.getPath(dataDeleteIcon)}
                onMouseEnter={this.dateHover}
                onMouseLeave={this.dateHover}
                onClick={this.deleteDate}
                style={styles.deleteButton}
              />
            :
              null
            }
          </div>
          <div style={styles.dateTime}>
            <div>{time || timePlaceholder}</div>
            {time && isActive ?
              <img
                src={Assets.getPath(timeDeleteIcon)}
                onMouseEnter={this.timeHover}
                onMouseLeave={this.timeHover}
                onClick={this.deleteTime}
                style={styles.deleteButton}
              />
            :
              null
            }
          </div>
        </div>
        <div style={styles.dateContainer}>
          {showCalendar && !toDo.is_complete ?
            <DateTime
              setDate={this.setDate}
              setTime={this.setTime}
              setHover={this.setHover}
              date={date}
              time={time}
              selectedTime={selectedTime}
              toDo={toDo}
              updateToDo={updateToDo}
            />
          :
            null
          }
        </div>
      </div>
    )
  }

}

const styles = {
  button: (date, isComplete, isActive) => ({
    minWidth: '80px',
    position: 'relative',
    color: getDateStatusColor(date, isComplete),
    border: isActive ? `1px solid ${Colors.button.blue}` : 'none',
    backgroundColor: isActive ? Colors.white : 'inherit',
    borderRadius: '5px'
  }),
  dateTime: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },
  deleteButton: {
    cursor: 'pointer',
    height: '14px',
    position: 'absolute',
    right: '0'
  },
  dateContainer: {
    position: 'absolute',
    right: '5px'
  }
}

const getDateStatusColor = (dateTime, isComplete) => {
  const dateTimeDays = moment().diff(dateTime, 'days')
  const pastDue = dateTimeDays > 0
  const dueToday = dateTimeDays === 0

  if (isComplete) {
    return Colors.gray.normal
  } else if (pastDue) {
    return Colors.pink.normal
  } else if (dueToday) {
    return Colors.background.green
  } else {
    return Colors.gray.normal
  }
}

ToDoDueDate.propTypes = {
  toDo: PropTypes.object.isRequired,

  updateToDo: PropTypes.func.isRequired
}

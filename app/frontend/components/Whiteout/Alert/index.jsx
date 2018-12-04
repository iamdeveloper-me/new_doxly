import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const statuses = [null, 'warning', 'error', 'success']

const Alert = ({ animated, dismissible, elevated, explanation, tall, message, subMessages, messageTitle, status }) => {

  const classNames = [
    'notification',
    status,
    animated ? 'animated' : null,
    elevated ? 'elevated' : null,
    tall ? 'global' : null,
    dismissible ? 'alert alert-dismissible show dismissible' : null
  ].join(' ')

  const messageTitleElement = (
    _.isArray(messageTitle) ?
      (
        <div>
          {messageTitle.map((title, index) =>
            <div key={index}>
              <b>{title}</b> {message}
            </div>
          )}
        </div>
      )
    :
      <div><b>{messageTitle}</b> {message}</div>
  )
  const subMessagesElement = (
    subMessages ?
      (
        <ul>
          {subMessages.map((subMessage, index) => <li key={index}>{subMessage}</li>)}
        </ul>
      )
    :
      null
  )
  const explanationElement = explanation ? <p>{explanation}</p> : null

  return (
    <div style={styles.alertContainer}>
      <div className={classNames}>
        <div className={'notification-message'}>
          {messageTitleElement}
          {subMessagesElement}
          {explanationElement}
        </div>
      </div>
    </div>
  )
}

const styles = {
  alertContainer: {
    width: '100%',
    display: 'block',
    textAlign: 'left'
  }
}

Alert.defaultProps = {
  animated: false,
  dismissible: false,
  elevated: false,
  message: null,
  tall: false
}

Alert.propTypes = {
  animated: PropTypes.bool,
  dismissible: PropTypes.bool,
  elevated: PropTypes.bool,
  explanation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  tall: PropTypes.bool,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  messageTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]).isRequired,
  status: PropTypes.oneOf(statuses),
  subMessages: PropTypes.array
}

export default Alert

import { Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class UserAvatar extends React.PureComponent {

  render() {
    const { user } = this.props

    if (user && user.avatar && user.avatar.url) {
      return <Image style={styles.imageAvatar} src={user.avatar.url}  circle />
    } else {
      return (
        <div style={styles.avatar(user.id)}>
          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
        </div>
      )
    }
  }

}

const styles = {
  avatar: userId => ({
    height: '30px',
    width: '30px',
    borderRadius: '50%',
    color: Colors.white,
    padding: '0 7px',
    fontWeight: 'bold',
    fontSize: '12px',
    background: getAvatarColor(userId),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0'
  }),
  imageAvatar: {
    height: '30px',
    width: '30px',
    objectFit: 'cover'
  }
}

const getAvatarColor = userId => {
  const colors = [Colors.avatar.orange, Colors.avatar.blue, Colors.avatar.gray]
  return colors[userId % 3]
}

UserAvatar.propTypes = {
  user: PropTypes.object.isRequired
}

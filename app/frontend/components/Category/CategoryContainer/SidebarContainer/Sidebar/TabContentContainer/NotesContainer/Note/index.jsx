import Assets from 'helpers/Assets'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {
  injectIntl,
  intlShape
} from 'react-intl'

import AlertTooltip from 'components/AlertTooltip/index.jsx'
import Colors from 'helpers/Colors'
import UserAvatar from 'components/UserAvatar/index.jsx'

class Note extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showTooltip: false,
      deleteHover: false
    }
    this.deleteNote = this.deleteNote.bind(this)
    this.canDelete = this.canDelete.bind(this)
    this.deleteIcon = this.deleteIcon.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onDeleteEnter = this.onDeleteEnter.bind(this)
    this.onDeleteLeave = this.onDeleteLeave.bind(this)
    this.toggleTooltip = this.toggleTooltip.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  onDeleteEnter() {
    this.setState({ deleteHover: true })
  }

  onDeleteLeave() {
    this.setState({ deleteHover: false })
  }

  deleteNote() {
    this.toggleTooltip()
    this.props.deleteNote(this.props.note, this.props.treeElement)
  }

  canDelete() {
    return Cookies.getJSON('authentication').email === this.props.note.entity_user.user.email
  }

  toggleTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip })
  }

  deleteIcon() {
    let icon
    if (this.canDelete()) {
      icon = (this.state.deleteHover || this.state.showTooltip) ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'
    } else {
      icon = 'ic-delete-disabled.svg'
    }
    return icon
  }

  render() {
    const { intl, note } = this.props
    const { hover, showTooltip } = this.state
    const hoverState = hover || showTooltip
    const date = moment(note.created_at).format('MMMM Do [at] h:mm a')
    const user = note.entity_user.user
    const noteHeader = this.canDelete() ? intl.formatMessage({id: 'category.sidebar.notes.delete'}) : null
    const noteText = !this.canDelete() ? intl.formatMessage({id: 'category.sidebar.notes.error'}) : null

    return (
      <div
        style={styles.container(hoverState)}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <UserAvatar user={user} />
        <div style={styles.note}>
          <div style={styles.info}>
            <div>{user.name}</div>
            <div>{date}</div>
          </div>
          <div style={styles.text}>{note.text}</div>
        </div>
        <div style={styles.spaceHolder(hoverState)}></div>
        <AlertTooltip
          position='top'
          interactive={true}
          showTooltip={showTooltip}
          setShowTooltip={this.toggleTooltip}
          header={noteHeader}
          text={noteText}
          canDelete={this.canDelete()}
          onDelete={this.deleteNote}
          icon={
            <img
              style={styles.deleteButton(hoverState)}
              src={Assets.getPath(this.deleteIcon())}
              onClick={this.toggleTooltip}
              onMouseEnter={this.onDeleteEnter}
              onMouseLeave={this.onDeleteLeave}
            />
          }
        />
      </div>
    )
  }

}

const styles = {
  container: isActive => ({
    width: '100%',
    padding: '8px 0px 8px 12px',
    paddingRight: isActive ? '12px' : '32px',
    display: 'flex',
    backgroundColor: isActive ? Colors.background.blue : Colors.white,
    position: 'relative'
  }),
  note: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '12px',
    width: '100%'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px'
  },
  text: {
    color: Colors.gray.darkest,
    fontSize: '12px'
  },
  deleteButton: hover => ({
    display: hover ? 'flex' : 'none',
    cursor: 'pointer',
    padding: '4px'
  }),
  spaceHolder: hover => ({
    display: hover ? 'none' : 'flex',
    width: '8px'
  })
}

Note.propTypes = {
  intl: intlShape.isRequired,
  note: PropTypes.object.isRequired,
  treeElement: PropTypes.object.isRequired,

  deleteNote: PropTypes.func.isRequired
}

export default injectIntl(Note)

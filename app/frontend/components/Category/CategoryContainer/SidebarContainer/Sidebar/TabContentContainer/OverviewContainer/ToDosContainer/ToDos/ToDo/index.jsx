import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  injectIntl,
  intlShape
} from 'react-intl'

import AlertTooltip from 'components/AlertTooltip/index.jsx'
import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import IconCheckbox from 'components/IconCheckbox/index.jsx'
import InlineEdit from 'components/InlineEdit/index.jsx'
import ToDoAssignee from './ToDoAssignee/index.jsx'
import ToDoDueDate from './ToDoDueDate/index.jsx'

class ToDo extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      deleteHover: false,
      textHover: false,
      isEditing: false,
      showTooltip: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onDeleteHover = this.onDeleteHover.bind(this)
    this.onTextHover = this.onTextHover.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onTextClick = this.onTextClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  onDeleteHover() {
    this.setState({ deleteHover: !this.state.deleteHover })
  }

  onTextClick() {
    this.setState({ isEditing: true })
  }

  onTextHover() {
    this.setState({ textHover: !this.state.textHover })
  }

  handleSubmit(value) {
    const { toDo } = this.props
    const update = toDo.id ? this.props.updateToDo : this.props.addToDo
    update(_.merge(toDo, { text: value }))
    this.setState({ isEditing: false })
  }

  onDelete() {
    this.props.deleteToDo(this.props.toDo)
    this.showTooltip()
  }

  onClick() {
    const { toDo } = this.props
    const { updateToDo } = this.props
    const updatedToDo = _.assign({}, toDo, { is_complete: !toDo.is_complete })

    updateToDo(updatedToDo, 'is_complete')
  }

  showTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip })
  }

  render() {
    const { intl, toDo, treeElement } = this.props
    const { updateToDo } = this.props
    const { deleteHover, hover, isEditing, textHover, showTooltip } = this.state
    const hoverState = showTooltip || hover
    const assignee = toDo.deal_entity_user ? toDo.deal_entity_user.entity_user.user.name : null
    const deleteIcon = deleteHover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'
    const textPlaceholder = intl.formatMessage({id: 'category.sidebar.to_dos.helper_text'})
    const toDoText = (isEditing && !toDo.is_complete) || !toDo.id ?
      <InlineEdit
        style={styles.text}
        initialValue={toDo.text}
        label='to-do'
        placeholder={textPlaceholder}
        handleSubmit={this.handleSubmit}
      />
    :
      <div
        style={styles.text(textHover && !toDo.is_complete)}
        onClick={this.onTextClick}
        onMouseEnter={this.onTextHover}
        onMouseLeave={this.onTextHover}
      >
        {toDo.text || textPlaceholder}
      </div>

    return (
      <div
        style={styles.container(toDo.is_complete, hoverState)}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <IconCheckbox
          checkedIcon={Assets.getPath('ic-todo-status-complete.svg')}
          uncheckedIcon={Assets.getPath('ic-todo-status-incomplete.svg')}
          isChecked={toDo.is_complete}
          updateAttribute={this.onClick}
          width='20px'
        />
        <div style={styles.toDo}>
          {toDoText}
          <ToDoAssignee
            assignee={assignee}
            toDo={toDo}
            treeElement={treeElement}
            updateToDo={updateToDo}
          />
        </div>
        <ToDoDueDate toDo={toDo} updateToDo={updateToDo} />
        <div style={styles.deletePlaceHolder(hoverState && !toDo.is_complete)}></div>
        <AlertTooltip
          position='top'
          text={intl.formatMessage({id: 'category.sidebar.to_dos.delete_to_do_header'})}
          showTooltip={this.state.showTooltip}
          setShowTooltip={this.showTooltip}
          onDelete={this.onDelete}
          icon={
            <img
              style={styles.deleteButton(hoverState && !toDo.is_complete)}
              src={Assets.getPath(deleteIcon)}
              onClick={this.showTooltip}
              onMouseEnter={this.onDeleteHover}
              onMouseLeave={this.onDeleteHover}
            />
          }
        />
      </div>
    )
  }

}

const styles = {
  container: (isComplete, hover) => ({
    width: '100%',
    display: 'flex',
    fontSize: '12px',
    padding: '4px 20px',
    justifyContent: 'space-between',
    opacity: isComplete ? '0.5' : '1',
    background: hover ? Colors.background.blue : 'none',
    position: 'relative'
  }),
  toDo: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '12px'
  },
  text: textHover => ({
    width: '100%',
    textDecoration: textHover ? `underline dashed ${Colors.button.blue}` : 'none'
  }),
  dueDate: isActive => ({
    paddingRight: isActive ? '0px' : '14px'
  }),
  deletePlaceHolder: icon => ({
    display: icon ? 'none' : 'flex',
    width: '18px'
  }),
  deleteButton: icon => ({
    display: icon ? 'flex' : 'none',
    flexShrink: 0,
    minWidth: '20px',
    maxWidth: '20px'
  })
}

ToDo.propTypes = {
  intl: intlShape.isRequired,
  toDo: PropTypes.object.isRequired,
  treeElement: PropTypes.object.isRequired,

  addToDo: PropTypes.func.isRequired,
  deleteToDo: PropTypes.func.isRequired,
  updateToDo: PropTypes.func.isRequired
}

export default injectIntl(ToDo)

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'

export default class EntityUser extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.onClick = this.onClick.bind(this)
    this.onHover = this.onHover.bind(this)
  }

  onHover() {
    this.setState({ hover: !this.state.hover })
  }

  onClick() {
    const { dealEntityUser, toDo } = this.props
    const { updateToDo } = this.props
    const updatedToDo = _.assign({}, toDo, { deal_entity_user_id: dealEntityUser.id })

    updateToDo(updatedToDo)
  }

  render() {
    const restrictedTreeElementIds = _.map(this.props.dealEntityUser.tree_element_restrictions, 'tree_element_id')
    const restricted = _.includes(restrictedTreeElementIds, this.props.treeElement.id)
    return (
      <div
        style={styles.user(this.state.hover, restricted)}
        onClick={this.onClick}
        onMouseEnter={this.onHover}
        onMouseLeave ={this.onHover}
      >
        {this.props.dealEntityUser.entity_user.user.name} { restricted ? '(restricted)' : null }
      </div>
    )
  }

}

const styles = {
  user: (hover, restricted) => ({
    opacity: restricted ? '0.5' : '1',
    padding: '2px 8px',
    cursor: 'pointer',
    color: hover ? Colors.white : Colors.gray.darkest,
    backgroundColor: hover ? Colors.button.blue : Colors.white
  })
}

EntityUser.propTypes = {
  toDo: PropTypes.object.isRequired,
  dealEntityUser: PropTypes.object.isRequired,
  treeElement: PropTypes.object.isRequired,

  updateToDo: PropTypes.func.isRequired
}

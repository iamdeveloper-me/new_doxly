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
    const { dealEntityUser, responsibleParty, toggleEntityDropdown, treeElement, updateParty } = this.props
    const updatedResponsibleParty = _.assign({}, responsibleParty, { deal_entity_user_id: dealEntityUser.id })

    updateParty(updatedResponsibleParty, treeElement)
    toggleEntityDropdown()
  }

  render() {
    const { dealEntityUser } = this.props

    return (
      <div
        style={styles.user(this.state.hover)}
        onClick={this.onClick}
        onMouseEnter={this.onHover}
        onMouseLeave ={this.onHover}
      >
        {dealEntityUser.entity_user.user.name}
      </div>
    )
  }

}

const styles = {
  user: hover => ({
    padding: '2px 4px',
    cursor: 'pointer',
    color: hover ? Colors.white : Colors.gray.darkest,
    backgroundColor: hover ? Colors.button.blue : Colors.white,
    fontStyle: 'normal'
  })
}

EntityUser.propTypes = {
  dealEntityUser: PropTypes.object.isRequired,
  responsibleParty: PropTypes.object.isRequired,

  updateParty: PropTypes.func.isRequired
}

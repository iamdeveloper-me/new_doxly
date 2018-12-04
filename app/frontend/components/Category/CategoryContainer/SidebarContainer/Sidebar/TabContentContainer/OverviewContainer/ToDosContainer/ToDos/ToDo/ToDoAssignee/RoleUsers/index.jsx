import PropTypes from 'prop-types'
import React from 'react'

import EntityUser from './EntityUser/index.jsx'

export default class RoleUsers extends React.PureComponent {
  render() {
    const roleUsersList = (
      this.props.roleUsers.map((deal_entity_user, index) => (
        <EntityUser
          key={index}
          dealEntityUser={deal_entity_user}
          toDo={this.props.toDo}
          updateToDo={this.props.updateToDo}
          treeElement={this.props.treeElement}
        />
      ))
    )

    return (
      <div>{roleUsersList}</div>
    )
  }
}

RoleUsers.propTypes = {
  roleUsers: PropTypes.array.isRequired,
  toDo: PropTypes.object.isRequired,
  treeElement: PropTypes.object.isRequired,

  updateToDo: PropTypes.func.isRequired
}

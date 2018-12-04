import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Dropdown from 'components/Dropdown/index.jsx'
import RoleUsers from './RoleUsers/index.jsx'
import Params from 'helpers/Params'
import Routes from 'helpers/Routes'

export default class ToDoAssignee extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dealRoles: []
    }
    this.getEntityUsers = this.getEntityUsers.bind(this)
    this.removeEntityUser = this.removeEntityUser.bind(this)
  }

  getEntityUsers() {
    const params = Params.fetch()
    Api.get(Routes.dealRoles(params.deals, ['deal_entities.entity', 'deal_entities.deal_entity_users.entity_user.user', 'deal_entities.deal_entity_users.tree_element_restrictions']))
      .then((roles) => {
        this.setState({ dealRoles: roles })
      })
  }

  removeEntityUser() {
    const { toDo } = this.props
    const { updateToDo } = this.props
    const updatedToDo = _.assign({}, toDo, { deal_entity_user_id: null })

    updateToDo(updatedToDo)
  }

  render() {
    const { assignee, toDo, treeElement } = this.props
    const { updateToDo } = this.props
    const emptyText = <FormattedMessage id='category.sidebar.to_dos.assignee_text' />
    const teamMembers = <FormattedMessage id='category.sidebar.to_dos.assignee_header' />

    const menuItems = (
      this.state.dealRoles.map((role, index) => (
        <div key={index}>
          <div style={styles.role}>{role.name}</div>
          <RoleUsers
            roleUsers={_.flatten(_.map(role.deal_entities, 'deal_entity_users'))}
            toDo={toDo}
            treeElement={treeElement}
            updateToDo={updateToDo}
          />
        </div>
      ))
    )

    return (
      <Dropdown
        emptyText={emptyText}
        getItems={this.getEntityUsers}
        header={teamMembers}
        label={assignee}
        menuItems={menuItems}
        isActive={!toDo.is_complete}
        removeItem={this.removeEntityUser}
        confirmDelete={false}
      />
    )
  }

}

const styles = {
  role: {
    paddingLeft: '4px'
  }
}

ToDoAssignee.propTypes = {
  assignee: PropTypes.string,
  toDo: PropTypes.object.isRequired,
  treeElement: PropTypes.object.isRequired,

  updateToDo: PropTypes.func.isRequired
}

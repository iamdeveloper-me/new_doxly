import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Party from './Party/index.jsx'

export default class ResponsibleParties extends React.PureComponent {
  render() {
    const { responsibleParties, roles, showEntityDropdown, showRolesDropdown, treeElement } = this.props
    const { addParty, deleteParty, toggleEntityDropdown, toggleRolesDropdown, updateParty } = this.props

    return (
      <div>
        {
          _.sortBy(responsibleParties, 'created_at').map((party, index) => (
            <Party
              key={index}
              addParty={addParty}
              deleteParty={deleteParty}
              responsibleParty={party}
              responsibleParties={responsibleParties}
              roles={roles}
              showEntityDropdown={showEntityDropdown}
              showRolesDropdown={showRolesDropdown}
              updateParty={updateParty}
              toggleEntityDropdown={toggleEntityDropdown}
              toggleRolesDropdown={toggleRolesDropdown}
              treeElement={treeElement}
            />
          ))
        }
      </div>
    )
  }

}

ResponsibleParties.propTypes = {
  responsibleParties: PropTypes.array.isRequired,
  roles: PropTypes.array,
  showEntityDropdown: PropTypes.bool.isRequired,
  showRolesDropdown: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,

  addParty: PropTypes.func.isRequired,
  deleteParty: PropTypes.func.isRequired,
  toggleEntityDropdown: PropTypes.func.isRequired,
  updateParty: PropTypes.func.isRequired
}

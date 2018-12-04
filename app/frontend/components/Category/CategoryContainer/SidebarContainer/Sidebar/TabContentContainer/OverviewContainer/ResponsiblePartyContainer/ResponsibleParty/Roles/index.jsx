import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Dropdown from 'components/Dropdown/index.jsx'
import ResponsibleParties from './ResponsibleParties/index.jsx'
import RoleEntities from './RoleEntities/index.jsx'

class Roles extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showEntityDropdown: false
    }
    this.toggleEntityDropdown = this.toggleEntityDropdown.bind(this)
  }

  toggleEntityDropdown() {
    this.setState({ showEntityDropdown: !this.state.showEntityDropdown })
  }

  render() {
    const { intl, responsibleParties, roles, showRolesDropdown, treeElement } = this.props
    const { addParty, deleteParty, toggleRolesDropdown, updateParty } = this.props
    const roleEntities = (
      roles.map((role, index) => (
        <RoleEntities
          key={index}
          addParty={addParty}
          updateParty={updateParty}
          role={role.name}
          entities={role.deal_entities}
          responsibleParties={responsibleParties}
          toggleEntityDropdown={this.toggleEntityDropdown}
          toggleRolesDropdown={toggleRolesDropdown}
          treeElement={treeElement}
        />
      ))
    )

    return (
      <div>
        <ResponsibleParties
          addParty={addParty}
          updateParty={updateParty}
          deleteParty={deleteParty}
          roles={roles}
          responsibleParties={responsibleParties}
          toggleEntityDropdown={this.toggleEntityDropdown}
          toggleRolesDropdown={toggleRolesDropdown}
          showEntityDropdown={this.state.showEntityDropdown}
          showRolesDropdown={showRolesDropdown}
          treeElement={treeElement}
        />
        <div style={styles.dropdown}>
          {showRolesDropdown && responsibleParties.length < 2 ?
            <Dropdown
              emptyText={<FormattedMessage id='category.sidebar.responsible_party.choose_responsible_party' />}
              header={<FormattedMessage id='category.sidebar.responsible_party.parties_wg' />}
              tooltipHeader={intl.formatMessage({id: 'category.sidebar.responsible_party.remove_party'})}
              showDropdown={true}
              label={null}
              menuItems={roleEntities}
              removeItem={toggleRolesDropdown}
              toggleDropdown={toggleRolesDropdown}
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
  dropdown: {
    width: '50%',
    cursor: 'pointer'
  }
}

Roles.propTypes = {
  intl: intlShape.isRequired,
  responsibleParties: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  showRolesDropdown: PropTypes.bool,
  treeElement: PropTypes.object.isRequired,

  addParty: PropTypes.func.isRequired,
  deleteParty: PropTypes.func.isRequired,
  toggleRolesDropdown: PropTypes.func.isRequired,
  updateParty: PropTypes.func.isRequired
}

export default injectIntl(Roles)

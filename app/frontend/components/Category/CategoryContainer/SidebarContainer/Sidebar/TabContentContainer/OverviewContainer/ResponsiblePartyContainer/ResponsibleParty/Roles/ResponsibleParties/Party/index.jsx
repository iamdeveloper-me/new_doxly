import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import AlertTooltip from 'components/AlertTooltip/index.jsx'
import Assets from 'helpers/Assets'
import Colors from 'helpers/Colors'
import Dropdown from 'components/Dropdown/index.jsx'
import EntityUser from './EntityUser/index.jsx'
import RoleEntities from 'components/Category/CategoryContainer/SidebarContainer/Sidebar/TabContentContainer/OverviewContainer/ResponsiblePartyContainer/ResponsibleParty/Roles/RoleEntities/index.jsx'

class Party extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      deleteHover: false,
      showTooltip: false
    }
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onMouseEnterDelete = this.onMouseEnterDelete.bind(this)
    this.onMouseLeaveDelete = this.onMouseLeaveDelete.bind(this)
    this.removeParty = this.removeParty.bind(this)
    this.removeKeyPerson = this.removeKeyPerson.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.toggleTooltip = this.toggleTooltip.bind(this)
  }

  onDelete() {
    const updatedResponsibleParty = _.assign({}, this.props.responsibleParty, { deal_entity_user_id: null, deal_entity_id: null })
    this.props.deleteParty(updatedResponsibleParty, this.props.treeElement)
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  onMouseEnterDelete() {
    this.setState({ deleteHover: true })
  }

  onMouseLeaveDelete() {
    this.setState({ deleteHover: false })
  }

  removeParty() {
    this.toggleTooltip()
    this.props.deleteParty(this.props.responsibleParty, this.props.treeElement)
  }

  removeKeyPerson() {
    const updatedParty = _.assign({}, this.props.responsibleParty, { deal_entity_user_id: null })
    this.props.updateParty(updatedParty, this.props.treeElement)
    this.props.toggleEntityDropdown()
  }

  onClose() {
    this.props.toggleEntityDropdown()
  }

  toggleTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip })
  }

  render() {
    const { intl, responsibleParty, responsibleParties, roles, showEntityDropdown, treeElement } = this.props
    const { addParty, toggleEntityDropdown, toggleRolesDropdown, updateParty } = this.props
    const { deleteHover, hover, showTooltip } = this.state

    const hoverState = showTooltip || hover
    const hasKeyPerson = responsibleParty.deal_entity_user
    const deleteIcon = deleteHover ? 'ic-delete-hover.svg' : 'ic-delete-neutral.svg'

    const roleEntities = (
      roles.map((role, index) => (
        <RoleEntities
          key={index}
          addParty={addParty}
          updateParty={updateParty}
          entities={role.deal_entities}
          role={role.name}
          responsibleParty={responsibleParty ? responsibleParty : null}
          responsibleParties={responsibleParties}
          toggleRolesDropdown={toggleRolesDropdown}
          treeElement={treeElement}
        />
      ))
    )

    const entityUsers = (
      responsibleParty.deal_entity.deal_entity_users.map((deal_entity_user) => (
        <EntityUser
          key={deal_entity_user.id}
          dealEntityUser={deal_entity_user}
          responsibleParty={responsibleParty}
          toggleEntityDropdown={toggleEntityDropdown}
          showEntityDropdown={showEntityDropdown}
          treeElement={treeElement}
          updateParty={updateParty}
        />
      ))
    )

    return (
      <div
        style={styles.container}
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        <div style={styles.roleDropdown}>
          <Dropdown
            header={<FormattedMessage id='category.sidebar.responsible_party.parties_wg' />}
            emptyText={
              <div style={styles.helperText}>
                <FormattedMessage id='category.sidebar.responsible_party.choose_responsible_party' />
              </div>
            }
            label={
              <div style={styles.label(responsibleParty.deal_entity.id)}>
                {responsibleParty.deal_entity.entity.name}
              </div>
            }
            tooltipHeader={intl.formatMessage({id: 'category.sidebar.responsible_party.remove_party'})}
            menuItems={roleEntities}
            removeButton={true}
            removeItem={this.removeParty}
            type='roles'
          />
        </div>
        <div style={styles.userDropdown}>
          {responsibleParty.deal_entity_user || showEntityDropdown || hoverState  ?
            <Dropdown
              emptyText={<FormattedMessage id='category.sidebar.responsible_party.assign_key_person' />}
              header={
                <div style={styles.header}>
                  {`${_.upperCase(responsibleParty.deal_entity.entity.name)} `}
                  <FormattedMessage id='category.sidebar.responsible_party.members' />
                </div>
              }
              label={hasKeyPerson ?
                <div style={styles.label(responsibleParty.deal_entity.id)}>
                  ({responsibleParty.deal_entity_user.entity_user.user.name})
                </div>
              :
                null
              }
              menuItems={entityUsers}
              removeButton={true}
              removeItem={hasKeyPerson ? this.removeKeyPerson : this.onClose}
              toggleDropdown={toggleEntityDropdown}
              tooltipHeader={intl.formatMessage({id: 'category.sidebar.responsible_party.remove_person'})}
              type='keyPerson'
            />
          :
            null
          }
        </div>
        <AlertTooltip
          header={intl.formatMessage({id: 'category.sidebar.responsible_party.remove_party'})}
          onDelete={this.removeParty}
          removeButton={true}
          setShowTooltip={this.toggleTooltip}
          showTooltip={showTooltip}
          icon={
            <img
              style={styles.deleteIcon(hoverState)}
              src={Assets.getPath(deleteIcon)}
              onClick={this.toggleTooltip}
              onMouseEnter={this.onMouseEnterDelete}
              onMouseLeave={this.onMouseLeaveDelete}
            />
          }
        />
      </div>
    )
  }

}

const styles = {
  container: {
    display: 'flex',
    position: 'relative',
    cursor: 'pointer'
  },
  roleDropdown: {
    maxWidth: '50%'
  },
  userDropdown: {
    maxWidth: '40%'
  },
  deleteIcon: icon => ({
    display: icon ? 'flex' : 'none',
    height: '18px',
    minWidth: '18px',
    marginLeft: '8px',
    cursor: 'pointer'
  }),
  deleteButton: {
    cursor: 'pointer',
    height: '20px'
  },
  helperText: {
    color: Colors.gray.normal
  },
  label: dealEntityId => ({
    fontStyle: 'normal',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: getPartyColor(dealEntityId)
  }),
  header: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}

const getPartyColor = dealEntityId => Colors.responsibleParty[dealEntityId % 20]

Party.propTypes = {
  intl: intlShape.isRequired,
  responsibleParties: PropTypes.array.isRequired,
  responsibleParty: PropTypes.object.isRequired,
  roles: PropTypes.array,
  showEntityDropdown: PropTypes.bool.isRequired,
  treeElement: PropTypes.object.isRequired,

  addParty: PropTypes.func.isRequired,
  deleteParty: PropTypes.func.isRequired,
  toggleEntityDropdown: PropTypes.func.isRequired,
  toggleRolesDropdown: PropTypes.func.isRequired,
  updateParty: PropTypes.func.isRequired
}

export default injectIntl(Party)

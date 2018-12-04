import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import AddButton from 'components/Buttons/AddButton/index.jsx'
import Colors from 'helpers/Colors'
import ResponsiblePartyDropdown from 'components/ResponsiblePartyDropdown/index.jsx'
import InlineEdit from 'components/InlineEdit/index.jsx'
import Roles from './Roles/index.jsx'

class ResponsibleParty extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      isEditing: false
    }
    this.addResponsibleParty = this.addResponsibleParty.bind(this)
    this.onClick = this.onClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
  }

  addResponsibleParty() {
    if (this.props.responsibleParties.length < 2) {
      this.props.toggleRolesDropdown()
    }
  }

  onClick(responsibleParty) {
    if (!responsibleParty.is_active) {
      this.props.setActiveParty(responsibleParty)
    }
  }

  handleSubmit(value) {
    const activeParty = _.find(this.props.responsibleParties, ['is_active', true])
    this.props.updateParty(activeParty, this.props.treeElement)
    this.setState({ isEditing: false })
  }

  onMouseEnterHandler() {
    this.setState({ hover: true })
  }

  onMouseLeaveHandler() {
    this.setState({ hover: false })
  }

  render() {
    const { entityUsers, intl, roles, responsibleParties, showRolesDropdown, treeElement } = this.props
    const { addParty, deleteParty, setActiveParty, toggleRolesDropdown, updateEditableTreeElement, updateParty } = this.props
    const { hover, isEditing } = this.state

    const activeParty = _.find(responsibleParties, ['is_active', true])

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <FormattedMessage id='category.sidebar.responsible_party.party_header' />
        </div>
        {activeParty ?
          <ResponsiblePartyDropdown
            activeParty={activeParty}
            responsibleParties={responsibleParties}
            treeElement={treeElement}
            updateEditableTreeElement={updateEditableTreeElement}
            updateParty={updateParty}
            setActiveParty={setActiveParty}
          />
        :
          null
        }
        <div style={styles.partiesContainer}>
          <div style={styles.partiesHeader}>
            <div style={styles.label}>
              <FormattedMessage id='category.sidebar.responsible_party.responsible_parties' />
            </div>
            <AddButton
              disabled={responsibleParties.length > 1}
              addElement={this.addResponsibleParty}
              text={<FormattedMessage id='category.sidebar.responsible_party.add_party' />}
              tooltipText={intl.formatMessage({id:'category.sidebar.responsible_party.responsible_parties_warning'})}
              hasTooltip={true}
            />
          </div>
          <div style={styles.orgs}>
            <Roles
              addParty={addParty}
              deleteParty={deleteParty}
              entityUsers={entityUsers}
              responsibleParties={responsibleParties}
              roles={roles}
              toggleRolesDropdown={toggleRolesDropdown}
              showRolesDropdown={showRolesDropdown}
              updateParty={updateParty}
              treeElement={treeElement}
            />
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    position: 'relative'
  },
  header: {
    color: Colors.gray.darkest,
    textTransform: 'uppercase'
  },
  status: {
    display: 'flex',
    paddingTop: '12px',
    alignItems: 'center'
  },
  partiesContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  partiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '24px'
  },
  label: {
    paddingRight: '8px',
    fontWeight: 'bold'
  },
  orgs: {
    display: 'flex',
    flexDirection: 'column'
  }
}

ResponsibleParty.propTypes = {
  entityUsers: PropTypes.array,
  intl: intlShape.isRequired,
  responsibleParties: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  showRolesDropdown: PropTypes.bool,
  treeElement: PropTypes.object.isRequired,

  addParty: PropTypes.func.isRequired,
  deleteParty: PropTypes.func.isRequired,
  setActiveParty: PropTypes.func.isRequired,
  toggleRolesDropdown: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateParty: PropTypes.func.isRequired
}

export default injectIntl(ResponsibleParty)

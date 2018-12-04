import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Colors from 'helpers/Colors'
import EmptyStateButton from 'components/Buttons/EmptyStateButton/index.jsx'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import ResponsibleParty from './ResponsibleParty/index.jsx'

class ResponsiblePartyContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      showRolesDropdown: false
    }
    this.toggleRolesDropdown = this.toggleRolesDropdown.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { treeElement } = this.props
    if (prevProps.treeElement.id !== treeElement.id) {
      this.setState({ showRolesDropdown: false })
    }
  }

  toggleRolesDropdown() {
    this.setState({ showRolesDropdown: !this.state.showRolesDropdown })
  }

  render() {
    const { roles, treeElement } = this.props
    const { addResponsibleParty, deleteResponsibleParty, setActiveParty, updateEditableTreeElement, updateResponsibleParty } = this.props
    const { isLoading, showRolesDropdown } = this.state
    const responsibleParties = treeElement.responsible_parties || []

    return (
      <div style={styles.container}>
        <div style={styles.content(isLoading)}>
          {responsibleParties.length > 0 || showRolesDropdown ?
            <ResponsibleParty
              responsibleParties={responsibleParties}
              roles={roles}
              showRolesDropdown={showRolesDropdown}
              treeElement={treeElement}
              addParty={addResponsibleParty}
              deleteParty={deleteResponsibleParty}
              getRoles={this.getRoles}
              toggleRolesDropdown={this.toggleRolesDropdown}
              updateParty={updateResponsibleParty}
              updateEditableTreeElement={updateEditableTreeElement}
              setActiveParty={setActiveParty}
            />
          :
            <EmptyStateButton
              header={<FormattedMessage id='category.sidebar.responsible_party.party_header' />}
              text={<FormattedMessage id='category.sidebar.responsible_party.add_party' />}
              subText={<FormattedMessage id='category.sidebar.responsible_party.add_party_detail' />}
              addElement={this.toggleRolesDropdown}
            />
          }
        </div>
        <div style={styles.loading(isLoading)}>
          <LoadingSpinner
            loadingText={<span><FormattedMessage id='category.checklist.uploading' /></span>}
            showLoadingBox={false}
          />
        </div>
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'relative'
  },
  content: loading => ({
    backgroundColor: Colors.white,
    padding: '12px 12px 20px 20px',
    borderBottom: `1px solid ${Colors.gray.lighter}`,
    color: Colors.gray.normal,
    fontSize: '12px',
    filter: loading ? 'blur(4px)' : ''
  }),
  loading: isLoading => ({
    display: isLoading ? 'flex' : 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(255,255,255,0.25)'
  })
}

ResponsiblePartyContainer.propTypes = {
  intl: intlShape.isRequired,
  roles: PropTypes.array.isRequired,
  treeElement: PropTypes.object.isRequired,

  addResponsibleParty: PropTypes.func.isRequired,
  deleteResponsibleParty: PropTypes.func.isRequired,
  setActiveParty: PropTypes.func.isRequired,
  updateEditableTreeElement: PropTypes.func.isRequired,
  updateResponsibleParty: PropTypes.func.isRequired
}

export default injectIntl(ResponsiblePartyContainer)
